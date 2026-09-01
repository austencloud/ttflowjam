import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWK } from "jose";
import { describe, expect, it } from "vitest";
import { verifyGoogleIdentityToken } from "./gallery-auth";

async function identityToken(overrides: Record<string, unknown> = {}) {
	const { privateKey, publicKey } = await generateKeyPair("RS256");
	const publicJwk: JWK = { ...(await exportJWK(publicKey)), alg: "RS256", kid: "google-test" };
	const token = await new SignJWT({
		email: "Moderator@Example.com",
		email_verified: true,
		name: "Taco Mod",
		picture: "https://example.com/avatar.jpg",
		...overrides,
	})
		.setProtectedHeader({ alg: "RS256", kid: "google-test" })
		.setSubject("google-user-123")
		.setIssuer("https://accounts.google.com")
		.setAudience("gallery-client-id")
		.setIssuedAt()
		.setExpirationTime("5m")
		.sign(privateKey);
	return { keySet: createLocalJWKSet({ keys: [publicJwk] }), token };
}

describe("verifyGoogleIdentityToken", () => {
	it("accepts a verified Google identity for the configured client", async () => {
		const { keySet, token } = await identityToken();
		await expect(verifyGoogleIdentityToken(token, "gallery-client-id", keySet)).resolves.toEqual({
			subject: "google-user-123",
			email: "moderator@example.com",
			name: "Taco Mod",
			picture: "https://example.com/avatar.jpg",
		});
	});

	it("rejects an unverified email address", async () => {
		const { keySet, token } = await identityToken({ email_verified: false });
		await expect(verifyGoogleIdentityToken(token, "gallery-client-id", keySet)).rejects.toThrow(
			"verified email"
		);
	});

	it("rejects a token for another OAuth client", async () => {
		const { keySet, token } = await identityToken();
		await expect(verifyGoogleIdentityToken(token, "another-client", keySet)).rejects.toThrow();
	});
});
