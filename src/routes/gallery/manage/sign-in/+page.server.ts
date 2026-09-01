import { getGalleryModerator, getGoogleClientId } from "$lib/server/gallery-auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const messages: Record<string, string> = {
	"not-allowed": "That Google account is not on the moderator list.",
	"sign-in": "Google sign-in did not finish. Please try again.",
};

export const load: PageServerLoad = async ({ request, platform, setHeaders, url }) => {
	if (await getGalleryModerator(request, platform)) {
		redirect(303, "/gallery/manage");
	}

	setHeaders({ "cache-control": "private, no-store" });
	return {
		clientId: getGoogleClientId(platform),
		errorMessage: messages[url.searchParams.get("error") ?? ""] ?? "",
	};
};
