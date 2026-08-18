import { error } from "@sveltejs/kit";
import { dev } from "$app/environment";
import type { RequestHandler } from "./$types";

const KEY_PATTERN = /^(thumb|full)\/[0-9a-f]{16}\.webp$/;

const HEADERS = {
	"cache-control": "public, max-age=31536000, immutable",
	"content-type": "image/webp",
};

export const GET: RequestHandler = async ({ params, platform }) => {
	if (!KEY_PATTERN.test(params.key)) {
		error(404, "Not found");
	}

	// Local dev has no R2 binding; serve from the gitignored build pile instead.
	if (dev) {
		const { readFile } = await import("node:fs/promises");
		try {
			const bytes = await readFile(`harvest/gallery-build/${params.key}`);
			return new Response(new Uint8Array(bytes), { headers: HEADERS });
		} catch {
			error(404, "Not found");
		}
	}

	const object = await platform?.env.TTFJ_MEDIA.get(`gallery/${params.key}`);
	if (!object) {
		error(404, "Not found");
	}

	return new Response(object.body, {
		headers: { ...HEADERS, etag: object.httpEtag },
	});
};
