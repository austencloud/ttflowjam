import { error, json } from "@sveltejs/kit";
import { requireGalleryModerator } from "$lib/server/gallery-auth";
import { hideGalleryMedia, restoreGalleryMedia } from "$lib/server/gallery-moderation";
import { hasGalleryMedia } from "$lib/services/gallery-catalog";
import type { RequestHandler } from "./$types";

interface ModerationRequest {
	mediaId?: unknown;
	action?: unknown;
}

export const POST: RequestHandler = async ({ request, platform, url }) => {
	const moderator = await requireGalleryModerator(request, platform);
	const origin = request.headers.get("origin");
	if (origin && origin !== url.origin) {
		error(403, "Cross-site moderation requests are not allowed.");
	}

	let body: ModerationRequest;
	try {
		body = (await request.json()) as ModerationRequest;
	} catch {
		error(400, "Invalid moderation request.");
	}

	if (typeof body.mediaId !== "string" || !hasGalleryMedia(body.mediaId)) {
		error(400, "Unknown gallery item.");
	}
	if (body.action !== "hide" && body.action !== "restore") {
		error(400, "Unknown moderation action.");
	}

	const moderation =
		body.action === "hide"
			? await hideGalleryMedia(platform, body.mediaId, moderator.email)
			: (await restoreGalleryMedia(platform, body.mediaId, moderator.email), null);

	return json(
		{ ok: true, mediaId: body.mediaId, action: body.action, moderation },
		{ headers: { "cache-control": "private, no-store" } }
	);
};
