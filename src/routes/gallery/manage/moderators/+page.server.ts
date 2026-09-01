import {
	addGalleryModerator,
	listGalleryModerators,
	requireGalleryOwner,
	revokeGalleryModerator,
} from "$lib/server/gallery-auth";
import { fail, isHttpError } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

function actionFailure(cause: unknown) {
	if (isHttpError(cause)) {
		return fail(cause.status, { message: cause.body.message });
	}
	return fail(500, { message: "That change did not save. Try again." });
}

export const load: PageServerLoad = async ({ request, platform, setHeaders }) => {
	const moderator = await requireGalleryOwner(request, platform);
	setHeaders({ "cache-control": "private, no-store" });
	return { moderator, moderators: await listGalleryModerators(platform) };
};

export const actions: Actions = {
	add: async ({ request, platform }) => {
		const owner = await requireGalleryOwner(request, platform);
		const form = await request.formData();
		const email = form.get("email");
		if (typeof email !== "string") {
			return fail(400, { message: "Enter an email address." });
		}
		try {
			await addGalleryModerator(platform, email, owner.email);
			return { success: true, message: `${email.trim().toLowerCase()} can now sign in.` };
		} catch (cause) {
			return actionFailure(cause);
		}
	},
	revoke: async ({ request, platform }) => {
		const owner = await requireGalleryOwner(request, platform);
		const form = await request.formData();
		const email = form.get("email");
		if (typeof email !== "string") {
			return fail(400, { message: "Moderator not found." });
		}
		try {
			await revokeGalleryModerator(platform, email, owner.email);
			return { success: true, message: `${email.trim().toLowerCase()} no longer has access.` };
		} catch (cause) {
			return actionFailure(cause);
		}
	},
};
