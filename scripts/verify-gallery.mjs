import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const mediaRoot = path.resolve(process.argv[2] ?? path.join(root, "harvest", "gallery-build"));
const manifest = JSON.parse(
	await readFile(path.join(root, "src", "lib", "data", "gallery-manifest.json"), "utf8")
);
const expectedYears = {
	2017: 89,
	2018: 43,
	2019: 243,
	2020: 15,
	2021: 17,
	2022: 4,
	2023: 66,
	2024: 47,
	2025: 24,
	2026: 286,
};
const expectedTypes = { photo: 722, video: 107, "raw-photo": 4, animation: 1 };

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

async function exists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

assert(manifest.length === 834, `Expected 834 manifest entries, found ${manifest.length}`);
assert(
	new Set(manifest.map((entry) => entry.id)).size === manifest.length,
	"Manifest IDs are not unique"
);

const yearCounts = Object.fromEntries(
	Object.keys(expectedYears).map((year) => [
		year,
		manifest.filter((entry) => entry.year === Number(year)).length,
	])
);
const typeCounts = Object.fromEntries(
	Object.keys(expectedTypes).map((type) => [
		type,
		manifest.filter((entry) => entry.type === type).length,
	])
);
assert(
	JSON.stringify(yearCounts) === JSON.stringify(expectedYears),
	`Wrong year counts: ${JSON.stringify(yearCounts)}`
);
assert(
	JSON.stringify(typeCounts) === JSON.stringify(expectedTypes),
	`Wrong type counts: ${JSON.stringify(typeCounts)}`
);

const [thumbFiles, previewFiles, fullFiles, videoFiles] = await Promise.all([
	readdir(path.join(mediaRoot, "thumb")),
	readdir(path.join(mediaRoot, "preview")),
	readdir(path.join(mediaRoot, "full")),
	readdir(path.join(mediaRoot, "video")),
]);
assert(thumbFiles.length === 834, `Expected 834 thumbnails, found ${thumbFiles.length}`);
assert(previewFiles.length === 834, `Expected 834 previews, found ${previewFiles.length}`);
assert(fullFiles.length === 834, `Expected 834 full images/posters, found ${fullFiles.length}`);
assert(videoFiles.length === 107, `Expected 107 videos, found ${videoFiles.length}`);

for (const entry of manifest) {
	const thumbPath = path.join(mediaRoot, "thumb", `${entry.id}.webp`);
	const previewPath = path.join(mediaRoot, "preview", `${entry.id}.webp`);
	const fullPath = path.join(mediaRoot, "full", `${entry.id}.webp`);
	assert(await exists(thumbPath), `Missing thumbnail ${entry.id}`);
	assert(await exists(previewPath), `Missing preview ${entry.id}`);
	assert(await exists(fullPath), `Missing full image ${entry.id}`);
	for (const [variant, filePath, maxDimension] of [
		["thumbnail", thumbPath, 640],
		["preview", previewPath, 1280],
		["full image", fullPath, 2048],
	]) {
		const metadata = await sharp(filePath).metadata();
		const width = metadata.width ?? 0;
		const height = metadata.pageHeight ?? metadata.height ?? 0;
		assert(width > 0 && height > 0, `Unreadable ${variant} ${entry.id}`);
		assert(
			width <= maxDimension && height <= maxDimension,
			`${variant} exceeds ${maxDimension}px for ${entry.id}`
		);
		assert(
			Math.abs(entry.w / entry.h - width / height) < 0.01,
			`${variant} aspect ratio mismatch for ${entry.id}`
		);
	}
	if (entry.type === "video") {
		assert(
			await exists(path.join(mediaRoot, "video", `${entry.id}.mp4`)),
			`Missing video ${entry.id}`
		);
	}
}

let totalVideoSeconds = 0;
for (const entry of manifest.filter((item) => item.type === "video")) {
	const videoPath = path.join(mediaRoot, "video", `${entry.id}.mp4`);
	const probe = JSON.parse(
		execFileSync(
			"ffprobe",
			[
				"-v",
				"error",
				"-show_entries",
				"format=duration:stream=codec_name,width,height,codec_type",
				"-of",
				"json",
				videoPath,
			],
			{ encoding: "utf8", maxBuffer: 1024 * 1024 }
		)
	);
	const videoStream = probe.streams?.find((stream) => stream.codec_type === "video");
	assert(videoStream?.codec_name === "h264", `Video ${entry.id} is not H.264`);
	assert(
		videoStream.width > 0 && videoStream.height > 0,
		`Video ${entry.id} has invalid dimensions`
	);
	const duration = Number(probe.format?.duration);
	assert(duration > 0, `Video ${entry.id} has invalid duration`);
	totalVideoSeconds += duration;
}

console.log(
	JSON.stringify(
		{
			manifest: manifest.length,
			years: yearCounts,
			types: typeCounts,
			thumbs: thumbFiles.length,
			previews: previewFiles.length,
			full: fullFiles.length,
			videos: videoFiles.length,
			videoHours: Number((totalVideoSeconds / 3600).toFixed(2)),
		},
		null,
		2
	)
);
