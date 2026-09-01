import {
	createGallerySession,
	getGoogleClientId,
	verifyGoogleIdentityToken,
} from "$lib/server/gallery-auth";
import { isHttpError, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

interface GoogleSignInRequest {
	credential?: unknown;
}

export const POST: RequestHandler = async ({ request, platform, cookies, url }) => {
	try {
		if (request.headers.get("origin") !== url.origin) {
			return json({ error: "Cross-site sign-in requests are not allowed." }, { status: 403 });
		}
		const body = (await request.json()) as GoogleSignInRequest;
		const credential = body.credential;
		if (typeof credential !== "string" || !credential) {
			throw new Error("Google credential is missing");
		}

		const identity = await verifyGoogleIdentityToken(credential, getGoogleClientId(platform));
		await createGallerySession(identity, platform, cookies);
		return json({ ok: true }, { headers: { "cache-control": "private, no-store" } });
	} catch (cause) {
		const notAllowed = isHttpError(cause) && cause.status === 403;
		return json(
			{
				error: notAllowed
					? "That Google account is not on the moderator list."
					: "Google sign-in did not finish. Please try again.",
			},
			{ status: notAllowed ? 403 : 400, headers: { "cache-control": "private, no-store" } }
		);
	}
};
