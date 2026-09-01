import { galleryMedia } from "$lib/services/gallery-catalog";
import { listGalleryModeration } from "$lib/server/gallery-moderation";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	const hiddenMedia = await listGalleryModeration(platform);
	setHeaders({ "cache-control": "private, max-age=0, must-revalidate" });
	return {
		media: galleryMedia.filter((media) => !hiddenMedia.has(media.id)),
	};
};
