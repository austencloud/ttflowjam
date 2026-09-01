import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const args = process.argv.slice(2);
const videosOnly = args.includes("--videos-only");
const videoStartArgument = args.find((argument) => argument.startsWith("--video-start="));
const videoStart = Number(videoStartArgument?.split("=")[1] ?? 0);
const mediaRootArgument = args.find((argument) => !argument.startsWith("--"));
const mediaRoot = path.resolve(mediaRootArgument ?? path.join(root, "harvest", "gallery-build"));
const manifest = JSON.parse(
	await readFile(path.join(root, "src", "lib", "data", "gallery-manifest.json"), "utf8")
);
const wrangler = path.join(root, "node_modules", "wrangler", "bin", "wrangler.js");
const cacheControl = "public, max-age=31536000, immutable";

async function requireFile(filePath) {
	try {
		await access(filePath);
	} catch {
		throw new Error(`Missing gallery file: ${filePath}`);
	}
}

function createTask(folder, id, extension, contentType) {
	return {
		filePath: path.join(mediaRoot, folder, `${id}.${extension}`),
		key: `gallery/${folder}/${id}.${extension}`,
		contentType,
	};
}

const imageTasks = manifest.flatMap((entry) => [
	createTask("thumb", entry.id, "webp", "image/webp"),
	createTask("preview", entry.id, "webp", "image/webp"),
	createTask("full", entry.id, "webp", "image/webp"),
]);
const videoTasks = manifest
	.filter((entry) => entry.type === "video")
	.map((entry) => createTask("video", entry.id, "mp4", "video/mp4"));
const pendingVideoTasks = videoTasks.slice(videoStart);

if (!Number.isInteger(videoStart) || videoStart < 0 || videoStart > videoTasks.length) {
	throw new Error(`Invalid --video-start value: ${videoStart}`);
}

for (const task of [...(videosOnly ? [] : imageTasks), ...pendingVideoTasks]) {
	await requireFile(task.filePath);
}

async function upload(task) {
	let lastError;
	for (let attempt = 1; attempt <= 3; attempt += 1) {
		try {
			await execFileAsync(
				process.execPath,
				[
					wrangler,
					"r2",
					"object",
					"put",
					`ttfj-media/${task.key}`,
					"--file",
					task.filePath,
					"--content-type",
					task.contentType,
					"--cache-control",
					cacheControl,
					"--remote",
					"--force",
				],
				{
					cwd: root,
					env: { ...process.env, CI: "1", NO_COLOR: "1" },
					maxBuffer: 2 * 1024 * 1024,
					windowsHide: true,
				}
			);
			return;
		} catch (error) {
			lastError = error;
			if (attempt < 3) {
				await delay(attempt * 1000);
			}
		}
	}
	throw new Error(`Failed to upload ${task.key}`, { cause: lastError });
}

async function uploadBatch(tasks, concurrency, label) {
	let cursor = 0;
	let completed = 0;
	async function worker() {
		while (cursor < tasks.length) {
			const task = tasks[cursor];
			cursor += 1;
			await upload(task);
			completed += 1;
			if (completed % 50 === 0 || completed === tasks.length) {
				console.log(`${label}: ${completed}/${tasks.length}`);
			}
		}
	}
	await Promise.all(Array.from({ length: concurrency }, worker));
}

console.log(
	`Uploading ${videosOnly ? 0 : imageTasks.length} images and ${pendingVideoTasks.length} videos to R2.`
);
if (!videosOnly) {
	await uploadBatch(imageTasks, 12, "Images");
}
await uploadBatch(pendingVideoTasks, 3, "Videos");
console.log("Gallery upload complete.");
