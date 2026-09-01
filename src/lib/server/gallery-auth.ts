import { dev } from "$app/environment";
import { error, type Cookies } from "@sveltejs/kit";
import type { D1Database } from "@cloudflare/workers-types";
import {
	base64url,
	createRemoteJWKSet,
	jwtVerify,
	type JWTPayload,
	type JWTVerifyGetKey,
} from "jose";

const sessionCookieName = "ttfj_gallery_session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 30;
const googleKeySet = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

interface GoogleIdentityClaims extends JWTPayload {
	email?: string;
	email_verified?: boolean;
	name?: string;
	picture?: string;
}

interface ModeratorRow {
	email: string;
	google_subject: string | null;
	role: "owner" | "moderator";
	display_name: string | null;
	avatar_url: string | null;
	added_at: string;
	added_by: string;
	revoked_at: string | null;
}

export interface GoogleIdentity {
	subject: string;
	email: string;
	name: string | null;
	picture: string | null;
}

export interface GalleryModerator {
	email: string;
	role: "owner" | "moderator";
	name: string | null;
	picture: string | null;
}

export interface GalleryModeratorRecord extends GalleryModerator {
	addedAt: string;
	addedBy: string;
	signedIn: boolean;
}

const localModerators = new Map<string, GalleryModeratorRecord>([
	[
		"local-moderator@ttflowjam.test",
		{
			email: "local-moderator@ttflowjam.test",
			role: "owner",
			name: "Local moderator",
			picture: null,
			addedAt: new Date().toISOString(),
			addedBy: "local",
			signedIn: true,
		},
	],
]);

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

function databaseFor(platform: App.Platform | undefined): D1Database {
	const database = platform?.env.TTFJ_MODERATION;
	if (!database) {
		error(503, "Gallery sign-in is temporarily unavailable.");
	}
	return database;
}

function rowToModerator(row: ModeratorRow): GalleryModerator {
	return {
		email: row.email,
		role: row.role,
		name: row.display_name,
		picture: row.avatar_url,
	};
}

function parseCookie(request: Request, name: string): string | null {
	const cookieHeader = request.headers.get("cookie");
	if (!cookieHeader) {
		return null;
	}
	for (const pair of cookieHeader.split(";")) {
		const separator = pair.indexOf("=");
		if (separator < 0) {
			continue;
		}
		if (pair.slice(0, separator).trim() === name) {
			return pair.slice(separator + 1).trim();
		}
	}
	return null;
}

async function sha256(value: string): Promise<string> {
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
	return base64url.encode(new Uint8Array(digest));
}

function createSessionToken(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return base64url.encode(bytes);
}

export function getGoogleClientId(platform: App.Platform | undefined): string {
	const clientId = platform?.env.GOOGLE_CLIENT_ID;
	if (!clientId) {
		error(503, "Google sign-in is not configured yet.");
	}
	return clientId;
}

export async function verifyGoogleIdentityToken(
	credential: string,
	clientId: string,
	keySet: JWTVerifyGetKey = googleKeySet
): Promise<GoogleIdentity> {
	const { payload } = await jwtVerify<GoogleIdentityClaims>(credential, keySet, {
		audience: clientId,
		issuer: ["https://accounts.google.com", "accounts.google.com"],
	});

	if (!payload.sub || !payload.email || payload.email_verified !== true) {
		throw new Error("Google account is missing a verified email address");
	}

	return {
		subject: payload.sub,
		email: normalizeEmail(payload.email),
		name: payload.name?.trim() || null,
		picture: payload.picture?.trim() || null,
	};
}

export async function createGallerySession(
	identity: GoogleIdentity,
	platform: App.Platform | undefined,
	cookies: Cookies
): Promise<GalleryModerator> {
	if (dev) {
		return localModerators.get("local-moderator@ttflowjam.test")!;
	}

	const database = databaseFor(platform);
	const ownerEmail = normalizeEmail(platform?.env.GALLERY_OWNER_EMAIL ?? "");
	let row = await database
		.prepare(
			"SELECT email, google_subject, role, display_name, avatar_url, added_at, added_by, revoked_at FROM gallery_moderators WHERE email = ? LIMIT 1"
		)
		.bind(identity.email)
		.first<ModeratorRow>();

	if (!row && identity.email === ownerEmail) {
		const now = new Date().toISOString();
		await database
			.prepare(
				"INSERT OR IGNORE INTO gallery_moderators (email, role, added_at, added_by) VALUES (?, 'owner', ?, 'bootstrap')"
			)
			.bind(identity.email, now)
			.run();
		row = await database
			.prepare(
				"SELECT email, google_subject, role, display_name, avatar_url, added_at, added_by, revoked_at FROM gallery_moderators WHERE email = ? LIMIT 1"
			)
			.bind(identity.email)
			.first<ModeratorRow>();
	}

	if (!row || row.revoked_at) {
		error(403, "This Google account is not on the moderator list.");
	}
	if (row.google_subject && row.google_subject !== identity.subject) {
		error(403, "This moderator email is linked to a different Google account.");
	}

	const now = new Date();
	const expiresAt = new Date(now.getTime() + sessionLifetimeSeconds * 1000);
	const token = createSessionToken();
	const tokenHash = await sha256(token);
	await database.batch([
		database
			.prepare(
				"UPDATE gallery_moderators SET google_subject = COALESCE(google_subject, ?), display_name = ?, avatar_url = ? WHERE email = ? AND revoked_at IS NULL"
			)
			.bind(identity.subject, identity.name, identity.picture, identity.email),
		database
			.prepare(
				"INSERT INTO gallery_sessions (token_hash, moderator_email, created_at, expires_at) VALUES (?, ?, ?, ?)"
			)
			.bind(tokenHash, identity.email, now.toISOString(), expiresAt.toISOString()),
	]);

	cookies.set(sessionCookieName, token, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/gallery/manage",
		maxAge: sessionLifetimeSeconds,
	});

	return {
		email: identity.email,
		role: row.role,
		name: identity.name,
		picture: identity.picture,
	};
}

export async function getGalleryModerator(
	request: Request,
	platform: App.Platform | undefined
): Promise<GalleryModerator | null> {
	if (dev) {
		return localModerators.get("local-moderator@ttflowjam.test")!;
	}

	const token = parseCookie(request, sessionCookieName);
	if (!token) {
		return null;
	}
	const tokenHash = await sha256(token);
	const row = await databaseFor(platform)
		.prepare(
			`SELECT m.email, m.google_subject, m.role, m.display_name, m.avatar_url,
				m.added_at, m.added_by, m.revoked_at
			FROM gallery_sessions s
			JOIN gallery_moderators m ON m.email = s.moderator_email
			WHERE s.token_hash = ? AND s.expires_at > ? AND m.revoked_at IS NULL
			LIMIT 1`
		)
		.bind(tokenHash, new Date().toISOString())
		.first<ModeratorRow>();

	return row ? rowToModerator(row) : null;
}

export async function requireGalleryModerator(
	request: Request,
	platform: App.Platform | undefined
): Promise<GalleryModerator> {
	const moderator = await getGalleryModerator(request, platform);
	if (!moderator) {
		error(401, "Moderator sign-in required.");
	}
	return moderator;
}

export async function requireGalleryOwner(
	request: Request,
	platform: App.Platform | undefined
): Promise<GalleryModerator> {
	const moderator = await requireGalleryModerator(request, platform);
	if (moderator.role !== "owner") {
		error(403, "Only the gallery owner can manage moderators.");
	}
	return moderator;
}

export async function destroyGallerySession(
	request: Request,
	platform: App.Platform | undefined,
	cookies: Cookies
): Promise<void> {
	const token = parseCookie(request, sessionCookieName);
	if (token && !dev) {
		await databaseFor(platform)
			.prepare("DELETE FROM gallery_sessions WHERE token_hash = ?")
			.bind(await sha256(token))
			.run();
	}
	cookies.delete(sessionCookieName, { path: "/gallery/manage" });
}

export async function listGalleryModerators(
	platform: App.Platform | undefined
): Promise<GalleryModeratorRecord[]> {
	if (dev) {
		return [...localModerators.values()];
	}
	const result = await databaseFor(platform)
		.prepare(
			"SELECT email, google_subject, role, display_name, avatar_url, added_at, added_by, revoked_at FROM gallery_moderators WHERE revoked_at IS NULL ORDER BY role DESC, added_at"
		)
		.all<ModeratorRow>();
	return (result.results ?? []).map((row) => ({
		...rowToModerator(row),
		addedAt: row.added_at,
		addedBy: row.added_by,
		signedIn: Boolean(row.google_subject),
	}));
}

export async function addGalleryModerator(
	platform: App.Platform | undefined,
	email: string,
	actorEmail: string
): Promise<void> {
	const normalized = normalizeEmail(email);
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
		error(400, "Enter a complete email address.");
	}
	const now = new Date().toISOString();
	if (dev) {
		localModerators.set(normalized, {
			email: normalized,
			role: "moderator",
			name: null,
			picture: null,
			addedAt: now,
			addedBy: actorEmail,
			signedIn: false,
		});
		return;
	}

	const database = databaseFor(platform);
	await database.batch([
		database
			.prepare(
				`INSERT INTO gallery_moderators (email, role, added_at, added_by)
				VALUES (?, 'moderator', ?, ?)
				ON CONFLICT(email) DO UPDATE SET revoked_at = NULL, added_at = excluded.added_at, added_by = excluded.added_by`
			)
			.bind(normalized, now, actorEmail),
		database
			.prepare(
				"INSERT INTO gallery_moderator_events (moderator_email, action, actor_email, created_at) VALUES (?, 'add', ?, ?)"
			)
			.bind(normalized, actorEmail, now),
	]);
}

export async function revokeGalleryModerator(
	platform: App.Platform | undefined,
	email: string,
	actorEmail: string
): Promise<void> {
	const normalized = normalizeEmail(email);
	if (normalized === normalizeEmail(actorEmail)) {
		error(400, "You cannot revoke your own access.");
	}
	const now = new Date().toISOString();
	if (dev) {
		localModerators.delete(normalized);
		return;
	}

	const database = databaseFor(platform);
	const target = await database
		.prepare("SELECT role FROM gallery_moderators WHERE email = ? AND revoked_at IS NULL")
		.bind(normalized)
		.first<{ role: "owner" | "moderator" }>();
	if (!target) {
		error(404, "Moderator not found.");
	}
	if (target.role === "owner") {
		error(400, "Owner access cannot be revoked here.");
	}

	await database.batch([
		database
			.prepare("UPDATE gallery_moderators SET revoked_at = ? WHERE email = ?")
			.bind(now, normalized),
		database.prepare("DELETE FROM gallery_sessions WHERE moderator_email = ?").bind(normalized),
		database
			.prepare(
				"INSERT INTO gallery_moderator_events (moderator_email, action, actor_email, created_at) VALUES (?, 'revoke', ?, ?)"
			)
			.bind(normalized, actorEmail, now),
	]);
}
