import { destroyGallerySession } from "$lib/server/gallery-auth";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, platform, cookies, url }) => {
	const origin = request.headers.get("origin");
	if (origin && origin !== url.origin) {
		error(403, "Cross-site sign-out requests are not allowed.");
	}
	await destroyGallerySession(request, platform, cookies);
	redirect(303, "/");
};
