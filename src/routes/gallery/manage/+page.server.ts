import { getGalleryModerator } from "$lib/server/gallery-auth";
import { listGalleryModeration } from "$lib/server/gallery-moderation";
import { galleryMedia } from "$lib/services/gallery-catalog";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request, platform, setHeaders }) => {
	const moderator = await getGalleryModerator(request, platform);
	if (!moderator) {
		redirect(303, "/gallery/manage/sign-in");
	}
	const hiddenMedia = await listGalleryModeration(platform);
	setHeaders({ "cache-control": "private, no-store" });

	return {
		moderator,
		media: galleryMedia.map((media) => ({
			...media,
			moderation: hiddenMedia.get(media.id) ?? null,
		})),
	};
};
