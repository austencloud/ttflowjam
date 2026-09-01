import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import { parseMediaByteRange } from "$lib/services/media-byte-range";

const KEY_PATTERN = /^(thumb|preview|full)\/([0-9a-f]{16})\.webp$|^video\/([0-9a-f]{16})\.mp4$/;

export interface GalleryMediaKey {
	key: string;
	mediaId: string;
	isVideo: boolean;
}

export function parseGalleryMediaKey(key: string): GalleryMediaKey | null {
	const match = KEY_PATTERN.exec(key);
	if (!match) {
		return null;
	}
	const mediaId = match[2] ?? match[3];
	if (!mediaId) {
		return null;
	}
	return {
		key,
		mediaId,
		isVideo: key.endsWith(".mp4"),
	};
}

function mediaHeaders(media: GalleryMediaKey, cacheControl: string) {
	return {
		"cache-control": cacheControl,
		"content-type": media.isVideo ? "video/mp4" : "image/webp",
		...(media.isVideo ? { "accept-ranges": "bytes" } : {}),
	};
}

export async function serveGalleryMedia(
	media: GalleryMediaKey,
	request: Request,
	platform: App.Platform | undefined,
	cacheControl: string
): Promise<Response> {
	const headers = mediaHeaders(media, cacheControl);
	const rangeHeader = media.isVideo ? request.headers.get("range") : null;

	// Local Vite has no R2 binding, so it reads the gitignored build pile.
	if (dev) {
		const { createReadStream } = await import("node:fs");
		const { readFile, stat } = await import("node:fs/promises");
		const { Readable } = await import("node:stream");
		const localPath = `harvest/gallery-build/${media.key}`;
		try {
			if (media.isVideo) {
				const metadata = await stat(localPath);
				if (rangeHeader) {
					const range = parseMediaByteRange(rangeHeader, metadata.size);
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
	const objectKey = `gallery/${media.key}`;
	if (rangeHeader && bucket) {
		const metadata = await bucket.head(objectKey);
		if (!metadata) {
			error(404, "Not found");
		}

		const range = parseMediaByteRange(rangeHeader, metadata.size);
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

		return new Response(object.body as unknown as ReadableStream, {
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

	return new Response(object.body as unknown as ReadableStream, {
		headers: { ...headers, "content-length": String(object.size), etag: object.httpEtag },
	});
}
