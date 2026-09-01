import { error } from "@sveltejs/kit";
import { requireGalleryModerator } from "$lib/server/gallery-auth";
import { parseGalleryMediaKey, serveGalleryMedia } from "$lib/server/gallery-media";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, platform, request }) => {
	await requireGalleryModerator(request, platform);
	const media = parseGalleryMediaKey(params.key);
	if (!media) {
		error(404, "Not found");
	}

	return serveGalleryMedia(media, request, platform, "private, no-store");
};
