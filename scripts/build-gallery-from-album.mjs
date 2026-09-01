import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { access, mkdir, readFile, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { setTimeout as delay } from "node:timers/promises";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const scanPath = path.join(root, "harvest", "google-photos", "full-album-scan.json");
const manifestPath = path.join(root, "src", "lib", "data", "gallery-manifest.json");
const outputRoot = path.resolve(process.argv[2] ?? path.join(root, "harvest", "gallery-build"));
const sourceCache = path.join(root, "harvest", "gallery-source-cache", "video");

const records = JSON.parse(await readFile(scanPath, "utf8"));
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const manifestById = new Map(manifest.map((entry) => [entry.id, entry]));

function galleryId(photoId) {
	return createHash("sha1").update(photoId).digest("hex").slice(0, 16);
}

async function exists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function isNonemptyFile(filePath) {
	try {
		const details = await stat(filePath);
		return details.isFile() && details.size > 0;
	} catch {
		return false;
	}
}

function assertCompleteSource() {
	const ids = new Set(records.map((record) => galleryId(record.photoId)));
	if (records.length !== manifest.length || ids.size !== manifest.length) {
		throw new Error(
			`Album scan has ${records.length} records and ${ids.size} IDs; manifest has ${manifest.length}`
		);
	}
	const missing = manifest.filter((entry) => !ids.has(entry.id));
	const extra = records.filter((record) => !manifestById.has(galleryId(record.photoId)));
	const withoutUrls = records.filter((record) => !record.imageUrl);
	if (missing.length || extra.length || withoutUrls.length) {
		throw new Error(
			`Album scan mismatch: ${missing.length} manifest IDs missing, ${extra.length} extra records, ${withoutUrls.length} URLs missing`
		);
	}
}

async function fetchWithRetry(url, attempts = 3, timeoutMs = 15 * 60 * 1000) {
	let lastError;
	for (let attempt = 1; attempt <= attempts; attempt += 1) {
		try {
			const response = await fetch(url, {
				redirect: "follow",
				signal: globalThis.AbortSignal.timeout(timeoutMs),
			});
			if (!response.ok || !response.body) {
				throw new Error(`HTTP ${response.status}`);
			}
			return response;
		} catch (error) {
			lastError = error;
			if (attempt < attempts) {
				await delay(attempt * 500);
			}
		}
	}
	throw lastError;
}

async function fetchBuffer(url) {
	const response = await fetchWithRetry(url);
	return Buffer.from(await response.arrayBuffer());
}

async function writeImageSet(input, id, animated = false) {
	const thumbPath = path.join(outputRoot, "thumb", `${id}.webp`);
	const previewPath = path.join(outputRoot, "preview", `${id}.webp`);
	const fullPath = path.join(outputRoot, "full", `${id}.webp`);
	if ((await exists(thumbPath)) && (await exists(previewPath)) && (await exists(fullPath))) {
		return;
	}
	const options = { animated, limitInputPixels: false };
	await Promise.all([
		sharp(input, { ...options, page: 0 })
			.rotate()
			.resize(640, 640, { fit: "inside", withoutEnlargement: true })
			.webp({ quality: 76, effort: 3 })
			.toFile(thumbPath),
		sharp(input, { ...options, page: 0 })
			.rotate()
			.resize(1280, 1280, { fit: "inside", withoutEnlargement: true })
			.webp({ quality: 80, effort: 4 })
			.toFile(previewPath),
		sharp(input, options)
			.rotate()
			.resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
			.webp({ quality: 84, effort: 4 })
			.toFile(fullPath),
	]);
}

async function buildImage(record) {
	const id = galleryId(record.photoId);
	const fullPath = path.join(outputRoot, "full", `${id}.webp`);
	if (
		(await exists(fullPath)) &&
		(await exists(path.join(outputRoot, "preview", `${id}.webp`))) &&
		(await exists(path.join(outputRoot, "thumb", `${id}.webp`)))
	) {
		return;
	}
	const source = await fetchBuffer(`${record.imageUrl}=w2048`);
	await writeImageSet(source, id, record.type === "animation");
}

async function downloadVideo(record, id) {
	const finalPath = path.join(sourceCache, `${id}.mp4`);
	if (await isNonemptyFile(finalPath)) {
		return finalPath;
	}
	await rm(finalPath, { force: true });
	const temporaryPath = `${finalPath}.partial`;
	let lastError;
	for (let attempt = 1; attempt <= 3; attempt += 1) {
		await rm(temporaryPath, { force: true });
		try {
			const response = await fetchWithRetry(`${record.imageUrl}=dv`, 1, 60 * 60 * 1000);
			await pipeline(Readable.fromWeb(response.body), createWriteStream(temporaryPath));
			if (!(await isNonemptyFile(temporaryPath))) {
				throw new Error(`Google Photos returned an empty video for ${id}`);
			}
			await rename(temporaryPath, finalPath);
			return finalPath;
		} catch (error) {
			lastError = error;
			if (attempt < 3) {
				await delay(attempt * 1000);
			}
		}
	}
	await rm(temporaryPath, { force: true });
	throw lastError;
}

async function transcodeVideo(sourcePath, outputPath) {
	const temporaryPath = `${outputPath}.partial.mp4`;
	await rm(temporaryPath, { force: true });
	const probe = JSON.parse(
		(
			await execFileAsync(
				"ffprobe",
				[
					"-v",
					"error",
					"-show_entries",
					"stream=codec_name,codec_type,width,height",
					"-of",
					"json",
					sourcePath,
				],
				{ maxBuffer: 1024 * 1024 }
			)
		).stdout
	);
	const video = probe.streams?.find((stream) => stream.codec_type === "video");
	const audio = probe.streams?.find((stream) => stream.codec_type === "audio");
	const canCopy =
		video?.codec_name === "h264" &&
		(video.width ?? 0) <= 1920 &&
		(video.height ?? 0) <= 1920 &&
		(!audio || audio.codec_name === "aac");
	const args = canCopy
		? [
				"-y",
				"-v",
				"error",
				"-i",
				sourcePath,
				"-c",
				"copy",
				"-movflags",
				"+faststart",
				temporaryPath,
			]
		: [
				"-y",
				"-v",
				"error",
				"-i",
				sourcePath,
				"-vf",
				"scale=w='min(1920,iw)':h='min(1920,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
				"-c:v",
				"libx264",
				"-preset",
				"veryfast",
				"-crf",
				"24",
				"-pix_fmt",
				"yuv420p",
				"-c:a",
				"aac",
				"-b:a",
				"128k",
				"-movflags",
				"+faststart",
				temporaryPath,
			];
	try {
		await execFileAsync("ffmpeg", args, { maxBuffer: 8 * 1024 * 1024 });
		if (!(await isNonemptyFile(temporaryPath))) {
			throw new Error(`ffmpeg returned an empty video for ${path.basename(outputPath)}`);
		}
		await rename(temporaryPath, outputPath);
	} catch (error) {
		await rm(temporaryPath, { force: true });
		throw error;
	}
}

async function buildVideo(record) {
	const id = galleryId(record.photoId);
	const outputPath = path.join(outputRoot, "video", `${id}.mp4`);
	const poster = await fetchBuffer(`${record.imageUrl}=w2048`);
	await writeImageSet(poster, id);
	if (await isNonemptyFile(outputPath)) {
		return;
	}
	await rm(outputPath, { force: true });
	const sourcePath = await downloadVideo(record, id);
	await transcodeVideo(sourcePath, outputPath);
}

async function processWithConcurrency(entries, concurrency, build, label) {
	let cursor = 0;
	let completed = 0;
	async function worker() {
		while (cursor < entries.length) {
			const record = entries[cursor];
			cursor += 1;
			await build(record);
			completed += 1;
			if (completed % 25 === 0 || completed === entries.length) {
				console.log(`${label}: ${completed}/${entries.length}`);
			}
		}
	}
	await Promise.all(Array.from({ length: concurrency }, worker));
}

assertCompleteSource();
await Promise.all([
	mkdir(path.join(outputRoot, "thumb"), { recursive: true }),
	mkdir(path.join(outputRoot, "preview"), { recursive: true }),
	mkdir(path.join(outputRoot, "full"), { recursive: true }),
	mkdir(path.join(outputRoot, "video"), { recursive: true }),
	mkdir(sourceCache, { recursive: true }),
]);

const images = records.filter((record) => record.type !== "video");
const videos = records.filter((record) => record.type === "video");
console.log(`Building ${images.length} images and ${videos.length} videos from the shared album.`);
await processWithConcurrency(images, 8, buildImage, "Images");
await processWithConcurrency(videos, 2, buildVideo, "Videos");
console.log(`Gallery media is ready in ${outputRoot}`);
