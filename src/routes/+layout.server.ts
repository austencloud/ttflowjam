import { ensureSiteWideGallerySession, getGalleryModerator } from "$lib/server/gallery-auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ request, platform, cookies }) => {
	const moderator = await getGalleryModerator(request, platform);
	if (moderator) {
		ensureSiteWideGallerySession(request, cookies);
	}
	return { moderator };
};
