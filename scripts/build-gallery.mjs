import { execFile, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import exifr from "exifr";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const exportRoot = path.resolve(
	process.argv[2] ?? path.join(root, "harvest", "google-photos", "export-2026-08-28")
);
const scanPath = path.join(root, "harvest", "google-photos", "full-album-scan.json");
const referenceRoot = path.join(root, "harvest", "google-photos", "scan-thumbs");
const outputRoot = path.join(root, "harvest", "gallery-build-next");
const manifestPath = path.join(root, "src", "lib", "data", "gallery-manifest.json");
const mapPath = path.join(root, "harvest", "google-photos", "archive-map.json");

const imageExtensions = new Set([".jpg", ".jpeg", ".heic", ".png", ".gif", ".dng", ".cr2"]);
const videoExtensions = new Set([".mp4", ".mov"]);
const rawExtensions = new Set([".dng", ".cr2"]);
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
	timeZone: "America/Chicago",
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hourCycle: "h23",
});

function fileStem(filePath) {
	const fileName = path.basename(filePath);
	return fileName.slice(0, -path.extname(fileName).length).toLowerCase();
}

function galleryId(photoId) {
	return createHash("sha1").update(photoId).digest("hex").slice(0, 16);
}

async function pathExists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

function dateKey(date) {
	const parts = Object.fromEntries(
		dateFormatter
			.formatToParts(date)
			.filter((part) => part.type !== "literal")
			.map((part) => [part.type, part.value])
	);
	return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function scanDateKey(record) {
	const dateText = record.label.split(" - ").at(-1).replaceAll(" ", " ");
	return dateKey(new Date(dateText));
}

function sourceDate(date) {
	if (!date) {
		return { key: null, year: null };
	}
	const key = dateKey(date);
	const year = Number(key.slice(0, 4));
	return year >= 2017 && year <= 2026 ? { key, year } : { key: null, year: null };
}

async function listFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await listFiles(entryPath)));
		} else {
			files.push(entryPath);
		}
	}
	return files;
}

async function imageDate(filePath) {
	try {
		const metadata = await exifr.parse(filePath, [
			"DateTimeOriginal",
			"CreateDate",
			"MediaCreateDate",
			"ModifyDate",
		]);
		return (
			metadata?.DateTimeOriginal ??
			metadata?.CreateDate ??
			metadata?.MediaCreateDate ??
			metadata?.ModifyDate ??
			null
		);
	} catch {
		return null;
	}
}

function videoMetadata(filePath) {
	const metadata = JSON.parse(
		execFileSync(
			"ffprobe",
			[
				"-v",
				"error",
				"-show_entries",
				"format=duration:format_tags=creation_time:stream_tags=creation_time",
				"-of",
				"json",
				filePath,
			],
			{ encoding: "utf8", maxBuffer: 1024 * 1024 }
		)
	);
	const dateValue =
		metadata.format?.tags?.creation_time ??
		metadata.streams?.find((stream) => stream.tags?.creation_time)?.tags?.creation_time;
	return {
		date: dateValue ? new Date(dateValue) : null,
		duration: Number(metadata.format?.duration) || 0,
	};
}

function differenceHashFromPixels(data) {
	const hash = new Uint8Array(256);
	for (let row = 0; row < 16; row += 1) {
		for (let column = 0; column < 16; column += 1) {
			hash[row * 16 + column] = data[row * 17 + column] > data[row * 17 + column + 1] ? 1 : 0;
		}
	}
	return hash;
}

async function imageHash(filePath) {
	let input = filePath;
	try {
		await sharp(filePath).metadata();
		if (rawExtensions.has(path.extname(filePath).toLowerCase())) {
			input = rawImageBuffer(filePath);
		}
	} catch {
		input = rawImageBuffer(filePath);
	}
	const { data } = await sharp(input)
		.rotate()
		.resize(17, 16, { fit: "fill" })
		.grayscale()
		.raw()
		.toBuffer({ resolveWithObject: true });
	return differenceHashFromPixels(data);
}

function rawImageBuffer(filePath) {
	try {
		return execFileSync(
			"ffmpeg",
			[
				"-v",
				"error",
				"-i",
				filePath,
				"-frames:v",
				"1",
				"-f",
				"image2pipe",
				"-vcodec",
				"png",
				"pipe:1",
			],
			{ encoding: null, maxBuffer: 128 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] }
		);
	} catch {
		return execFileSync("magick", [`${filePath}[0]`, "-auto-orient", "-depth", "8", "png:-"], {
			encoding: null,
			maxBuffer: 128 * 1024 * 1024,
		});
	}
}

function videoHashes(filePath, duration) {
	const times = [
		...new Set([0.05, Math.min(Math.max(duration * 0.1, 0.25), 2), duration / 2]),
	].filter((time) => Number.isFinite(time) && time >= 0 && (duration === 0 || time < duration));
	const hashes = [];
	for (const time of times) {
		try {
			const pixels = execFileSync(
				"ffmpeg",
				[
					"-v",
					"error",
					"-ss",
					String(time),
					"-i",
					filePath,
					"-frames:v",
					"1",
					"-vf",
					"scale=17:16",
					"-pix_fmt",
					"gray",
					"-f",
					"rawvideo",
					"pipe:1",
				],
				{ encoding: null, maxBuffer: 1024 * 1024 }
			);
			if (pixels.length >= 17 * 16) {
				hashes.push(differenceHashFromPixels(pixels));
			}
		} catch {
			// Try the other sample times before treating the clip as unreadable.
		}
	}
	if (hashes.length === 0) {
		throw new Error(`Could not read a video frame from ${filePath}`);
	}
	return hashes;
}

function hashDistance(left, right) {
	let total = 0;
	for (let index = 0; index < left.length; index += 1) {
		total += left[index] === right[index] ? 0 : 1;
	}
	return total;
}

const sourceHashCache = new Map();
const referenceHashCache = new Map();

async function sourceHashes(source) {
	if (!sourceHashCache.has(source.filePath)) {
		sourceHashCache.set(
			source.filePath,
			source.video
				? Promise.resolve(videoHashes(source.filePath, source.duration))
				: imageHash(source.filePath).then((hash) => [hash])
		);
	}
	return sourceHashCache.get(source.filePath);
}

async function referenceHash(record) {
	if (!referenceHashCache.has(record.photoId)) {
		referenceHashCache.set(
			record.photoId,
			imageHash(path.join(referenceRoot, `${record.photoId}.jpg`))
		);
	}
	return referenceHashCache.get(record.photoId);
}

async function visualDistance(source, record) {
	const [hashes, reference] = await Promise.all([sourceHashes(source), referenceHash(record)]);
	return Math.min(...hashes.map((hash) => hashDistance(hash, reference)));
}

async function assignByDistance(sources, records, mapping, method) {
	const pairs = [];
	for (const source of sources) {
		for (const record of records) {
			let distance = await visualDistance(source, record);
			if (source.year && source.year !== record.year) {
				distance += 512;
			}
			pairs.push({ source, record, distance });
		}
	}
	pairs.sort((left, right) => left.distance - right.distance);

	const usedSources = new Set();
	const usedRecords = new Set();
	for (const pair of pairs) {
		if (usedSources.has(pair.source) || usedRecords.has(pair.record)) {
			continue;
		}
		mapping.set(pair.record.photoId, { source: pair.source, method, distance: pair.distance });
		usedSources.add(pair.source);
		usedRecords.add(pair.record);
		if (usedSources.size === Math.min(sources.length, records.length)) {
			break;
		}
	}
	return { usedSources, usedRecords };
}

const scan = JSON.parse(await readFile(scanPath, "utf8")).map((record) => ({
	...record,
	dateKey: scanDateKey(record),
}));
const allFiles = await listFiles(exportRoot);
const imageFiles = allFiles.filter((filePath) =>
	imageExtensions.has(path.extname(filePath).toLowerCase())
);
const imageStems = new Set(imageFiles.map(fileStem));
const videoFiles = allFiles.filter((filePath) => {
	const extension = path.extname(filePath).toLowerCase();
	return videoExtensions.has(extension) && !imageStems.has(fileStem(filePath));
});

if (
	imageFiles.length !== 727 ||
	videoFiles.length !== 107 ||
	imageFiles.length + videoFiles.length !== scan.length
) {
	throw new Error(
		`Archive mismatch: ${imageFiles.length} images and ${videoFiles.length} videos for ${scan.length} album items`
	);
}

const sources = [];
for (const filePath of imageFiles) {
	const date = await imageDate(filePath);
	const normalizedDate = sourceDate(date);
	sources.push({
		filePath,
		video: false,
		duration: 0,
		dateKey: normalizedDate.key,
		year: normalizedDate.year,
	});
}
for (const filePath of videoFiles) {
	const metadata = videoMetadata(filePath);
	const normalizedDate = sourceDate(metadata.date);
	sources.push({
		filePath,
		video: true,
		duration: metadata.duration,
		dateKey: normalizedDate.key,
		year: normalizedDate.year,
	});
}

const mapping = new Map();
const assignedSources = new Set();
const recordsByGroup = Map.groupBy(
	scan,
	(record) => `${record.type === "video" ? "video" : "image"}|${record.dateKey}`
);
const sourcesByGroup = Map.groupBy(
	sources.filter((source) => source.dateKey),
	(source) => `${source.video ? "video" : "image"}|${source.dateKey}`
);

for (const [key, records] of recordsByGroup) {
	const groupSources = sourcesByGroup.get(key) ?? [];
	if (groupSources.length === 0) {
		continue;
	}
	if (groupSources.length === 1 && records.length === 1) {
		mapping.set(records[0].photoId, { source: groupSources[0], method: "timestamp", distance: 0 });
		assignedSources.add(groupSources[0]);
		continue;
	}
	const assignment = await assignByDistance(groupSources, records, mapping, "timestamp+visual");
	for (const source of assignment.usedSources) {
		assignedSources.add(source);
	}
}

const assignedRecordIds = new Set(mapping.keys());
for (const video of [false, true]) {
	const remainingSources = sources.filter(
		(source) => source.video === video && !assignedSources.has(source)
	);
	const remainingRecords = scan.filter(
		(record) => (record.type === "video") === video && !assignedRecordIds.has(record.photoId)
	);
	if (remainingSources.length !== remainingRecords.length) {
		throw new Error(
			`Unmatched ${video ? "video" : "image"} count differs: ${remainingSources.length} archive, ${remainingRecords.length} album`
		);
	}
	const assignment = await assignByDistance(remainingSources, remainingRecords, mapping, "visual");
	for (const source of assignment.usedSources) {
		assignedSources.add(source);
	}
	for (const record of assignment.usedRecords) {
		assignedRecordIds.add(record.photoId);
	}
}

if (mapping.size !== scan.length || assignedSources.size !== sources.length) {
	throw new Error(
		`Mapping incomplete: ${mapping.size} records and ${assignedSources.size} sources`
	);
}

const mapEntries = scan.map((record) => {
	const match = mapping.get(record.photoId);
	return {
		photoId: record.photoId,
		type: record.type,
		year: record.year,
		source: path.basename(match.source.filePath),
		sourceDate: match.source.dateKey,
		method: match.method,
		distance: match.distance,
	};
});
await writeFile(mapPath, `${JSON.stringify(mapEntries, null, 2)}\n`);

const thumbRoot = path.join(outputRoot, "thumb");
const fullRoot = path.join(outputRoot, "full");
const videoRoot = path.join(outputRoot, "video");
await Promise.all([
	mkdir(thumbRoot, { recursive: true }),
	mkdir(fullRoot, { recursive: true }),
	mkdir(videoRoot, { recursive: true }),
]);

async function imageOutputs(record, source) {
	const id = galleryId(record.photoId);
	const fullPath = path.join(fullRoot, `${id}.webp`);
	const thumbPath = path.join(thumbRoot, `${id}.webp`);
	const animated = record.type === "animation";
	if ((await pathExists(fullPath)) && (await pathExists(thumbPath))) {
		const metadata = await sharp(fullPath).metadata();
		return { id, w: metadata.width, h: metadata.pageHeight ?? metadata.height };
	}
	const input = rawExtensions.has(path.extname(source.filePath).toLowerCase())
		? rawImageBuffer(source.filePath)
		: source.filePath;
	await Promise.all([
		sharp(input, { animated, limitInputPixels: false })
			.rotate()
			.resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
			.webp({ quality: 82, effort: 4 })
			.toFile(fullPath),
		sharp(input, { page: 0, limitInputPixels: false })
			.rotate()
			.resize(640, 640, { fit: "inside", withoutEnlargement: true })
			.webp({ quality: 75, effort: 3 })
			.toFile(thumbPath),
	]);
	const metadata = await sharp(fullPath).metadata();
	return { id, w: metadata.width, h: metadata.pageHeight ?? metadata.height };
}

async function runFfmpeg(args) {
	try {
		await execFileAsync("ffmpeg", args, { maxBuffer: 8 * 1024 * 1024 });
	} catch (error) {
		throw new Error(error.stderr?.toString().slice(-4000) || error.message);
	}
}

async function videoOutputs(record, source) {
	const id = galleryId(record.photoId);
	const videoPath = path.join(videoRoot, `${id}.mp4`);
	const fullPath = path.join(fullRoot, `${id}.webp`);
	const thumbPath = path.join(thumbRoot, `${id}.webp`);
	if (
		(await pathExists(videoPath)) &&
		(await pathExists(fullPath)) &&
		(await pathExists(thumbPath))
	) {
		try {
			const duration = Number(
				execFileSync(
					"ffprobe",
					["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", videoPath],
					{ encoding: "utf8", maxBuffer: 1024 * 1024 }
				).trim()
			);
			if (duration > 0) {
				const metadata = await sharp(fullPath).metadata();
				return { id, w: metadata.width, h: metadata.height };
			}
		} catch {
			// A partial MP4 from an interrupted build will be replaced below.
		}
	}
	const posterTime = Math.min(Math.max(source.duration * 0.1, 0.25), 2);
	const { stdout: poster } = await execFileAsync(
		"ffmpeg",
		[
			"-v",
			"error",
			"-ss",
			String(posterTime),
			"-i",
			source.filePath,
			"-frames:v",
			"1",
			"-f",
			"image2pipe",
			"-vcodec",
			"png",
			"pipe:1",
		],
		{ encoding: null, maxBuffer: 64 * 1024 * 1024 }
	);
	await Promise.all([
		sharp(poster)
			.resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
			.webp({ quality: 82, effort: 4 })
			.toFile(fullPath),
		sharp(poster)
			.resize(640, 640, { fit: "inside", withoutEnlargement: true })
			.webp({ quality: 75, effort: 3 })
			.toFile(thumbPath),
		runFfmpeg([
			"-y",
			"-v",
			"error",
			"-i",
			source.filePath,
			"-vf",
			"scale=w='min(1920,iw)':h='min(1920,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
			"-c:v",
			"h264_nvenc",
			"-preset",
			"p1",
			"-tune",
			"hq",
			"-rc",
			"vbr",
			"-cq",
			"25",
			"-b:v",
			"0",
			"-maxrate",
			"8M",
			"-bufsize",
			"16M",
			"-pix_fmt",
			"yuv420p",
			"-c:a",
			"aac",
			"-b:a",
			"128k",
			"-movflags",
			"+faststart",
			videoPath,
		]),
	]);
	const metadata = await sharp(fullPath).metadata();
	return { id, w: metadata.width, h: metadata.height };
}

async function processWithConcurrency(entries, concurrency, processor, label) {
	let cursor = 0;
	let completed = 0;
	const results = new Map();
	async function worker() {
		while (cursor < entries.length) {
			const record = entries[cursor];
			cursor += 1;
			const match = mapping.get(record.photoId);
			const result = await processor(record, match.source);
			results.set(record.photoId, result);
			completed += 1;
			if (completed % 25 === 0 || completed === entries.length) {
				console.log(`${label}: ${completed}/${entries.length}`);
			}
		}
	}
	await Promise.all(Array.from({ length: concurrency }, () => worker()));
	return results;
}

const imageRecords = scan.filter((record) => record.type !== "video");
const videoRecords = scan.filter((record) => record.type === "video");
console.log(
	`Mapped ${scan.length} album items. Building ${imageRecords.length} images and ${videoRecords.length} videos.`
);
const imageResults = await processWithConcurrency(imageRecords, 6, imageOutputs, "Images");
const videoResults = await processWithConcurrency(videoRecords, 8, videoOutputs, "Videos");
const results = new Map([...imageResults, ...videoResults]);

const manifest = scan.toReversed().map((record) => {
	const result = results.get(record.photoId);
	return {
		id: result.id,
		w: result.w,
		h: result.h,
		year: record.year,
		type: record.type,
	};
});
await writeFile(manifestPath, `${JSON.stringify(manifest, null, "\t")}\n`);
console.log(`Wrote ${manifest.length} manifest entries to ${manifestPath}`);
