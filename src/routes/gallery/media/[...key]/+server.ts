import { error } from "@sveltejs/kit";
import { dev } from "$app/environment";
import type { RequestHandler } from "./$types";

const KEY_PATTERN = /^(thumb|full)\/[0-9a-f]{16}\.webp$|^video\/[0-9a-f]{16}\.mp4$/;

const CACHE_HEADERS = {
	"cache-control": "public, max-age=31536000, immutable",
};

function parseRange(rangeHeader: string, size: number) {
	const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
	if (!match) {
		return null;
	}

	const start = match[1] ? Number(match[1]) : 0;
	const end = match[2] ? Number(match[2]) : size - 1;
	if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
		return null;
	}

	return { start, end: Math.min(end, size - 1) };
}

function mediaHeaders(key: string) {
	return {
		...CACHE_HEADERS,
		"content-type": key.endsWith(".mp4") ? "video/mp4" : "image/webp",
		...(key.endsWith(".mp4") ? { "accept-ranges": "bytes" } : {}),
	};
}

export const GET: RequestHandler = async ({ params, platform, request }) => {
	if (!KEY_PATTERN.test(params.key)) {
		error(404, "Not found");
	}

	const headers = mediaHeaders(params.key);
	const rangeHeader = params.key.endsWith(".mp4") ? request.headers.get("range") : null;

	// Local dev has no R2 binding; serve from the gitignored build pile instead.
	if (dev) {
		const { createReadStream } = await import("node:fs");
		const { readFile, stat } = await import("node:fs/promises");
		const { Readable } = await import("node:stream");
		const localPath = `harvest/gallery-build/${params.key}`;
		try {
			if (params.key.endsWith(".mp4")) {
				const metadata = await stat(localPath);
				if (rangeHeader) {
					const range = parseRange(rangeHeader, metadata.size);
					if (!range) {
						return new Response(null, {
							status: 416,
							headers: { ...headers, "content-range": `bytes */${metadata.size}` },
						});
					}

					const body = Readable.toWeb(createReadStream(localPath, range));
					return new Response(body as ReadableStream, {
						status: 206,
						headers: {
							...headers,
							"content-length": String(range.end - range.start + 1),
							"content-range": `bytes ${range.start}-${range.end}/${metadata.size}`,
						},
					});
				}

				const body = Readable.toWeb(createReadStream(localPath));
				return new Response(body as ReadableStream, {
					headers: { ...headers, "content-length": String(metadata.size) },
				});
			}

			const bytes = await readFile(localPath);
			return new Response(new Uint8Array(bytes), {
				headers: { ...headers, "content-length": String(bytes.byteLength) },
			});
		} catch {
			error(404, "Not found");
		}
	}

	const bucket = platform?.env.TTFJ_MEDIA;
	const objectKey = `gallery/${params.key}`;
	if (rangeHeader && bucket) {
		const metadata = await bucket.head(objectKey);
		if (!metadata) {
			error(404, "Not found");
		}

		const range = parseRange(rangeHeader, metadata.size);
		if (!range) {
			return new Response(null, {
				status: 416,
				headers: { ...headers, "content-range": `bytes */${metadata.size}` },
			});
		}

		const object = await bucket.get(objectKey, {
			range: { offset: range.start, length: range.end - range.start + 1 },
		});
		if (!object) {
			error(404, "Not found");
		}

		return new Response(object.body, {
			status: 206,
			headers: {
				...headers,
				"content-length": String(range.end - range.start + 1),
				"content-range": `bytes ${range.start}-${range.end}/${metadata.size}`,
				etag: object.httpEtag,
			},
		});
	}

	const object = await bucket?.get(objectKey);
	if (!object) {
		error(404, "Not found");
	}

	return new Response(object.body, {
		headers: { ...headers, "content-length": String(object.size), etag: object.httpEtag },
	});
};
