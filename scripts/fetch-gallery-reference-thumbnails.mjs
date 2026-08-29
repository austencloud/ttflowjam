import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const scanPath = path.join(root, "harvest", "google-photos", "full-album-scan.json");
const outputDir = path.join(root, "harvest", "google-photos", "scan-thumbs");
const records = JSON.parse(await readFile(scanPath, "utf8"));

await mkdir(outputDir, { recursive: true });

let cursor = 0;
let completed = 0;

async function download(record) {
	const outputPath = path.join(outputDir, `${record.photoId}.jpg`);
	for (let attempt = 1; attempt <= 3; attempt += 1) {
		try {
			const response = await fetch(record.imageUrl);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}
			await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
			completed += 1;
			if (completed % 100 === 0 || completed === records.length) {
				console.log(`${completed}/${records.length}`);
			}
			return;
		} catch (error) {
			if (attempt === 3) {
				throw new Error(`${record.photoId}: ${error.message}`);
			}
		}
	}
}

async function worker() {
	while (cursor < records.length) {
		const record = records[cursor];
		cursor += 1;
		await download(record);
	}
}

await Promise.all(Array.from({ length: 12 }, () => worker()));
