import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import type { D1Database } from "@cloudflare/workers-types";

interface ModerationRow {
	media_id: string;
	hidden_at: string;
	hidden_by: string;
}

export interface GalleryModerationState {
	mediaId: string;
	hiddenAt: string;
	hiddenBy: string;
}

const localHiddenMedia = new Map<string, GalleryModerationState>();

function databaseFor(platform: App.Platform | undefined): D1Database | null {
	const database = platform?.env.TTFJ_MODERATION;
	if (!database && !dev) {
		error(503, "Gallery moderation is temporarily unavailable.");
	}
	return database ?? null;
}

function mapRow(row: ModerationRow): GalleryModerationState {
	return {
		mediaId: row.media_id,
		hiddenAt: row.hidden_at,
		hiddenBy: row.hidden_by,
	};
}

export async function listGalleryModeration(
	platform: App.Platform | undefined
): Promise<Map<string, GalleryModerationState>> {
	const database = databaseFor(platform);
	if (!database) {
		return new Map(localHiddenMedia);
	}

	const result = await database
		.prepare("SELECT media_id, hidden_at, hidden_by FROM gallery_hidden_media")
		.all<ModerationRow>();
	return new Map((result.results ?? []).map((row) => [row.media_id, mapRow(row)]));
}

export async function isGalleryMediaHidden(
	platform: App.Platform | undefined,
	mediaId: string
): Promise<boolean> {
	const database = databaseFor(platform);
	if (!database) {
		return localHiddenMedia.has(mediaId);
	}

	const row = await database
		.prepare("SELECT media_id FROM gallery_hidden_media WHERE media_id = ? LIMIT 1")
		.bind(mediaId)
		.first<{ media_id: string }>();
	return Boolean(row);
}

export async function hideGalleryMedia(
	platform: App.Platform | undefined,
	mediaId: string,
	actorEmail: string
): Promise<GalleryModerationState> {
	const hiddenAt = new Date().toISOString();
	const state = { mediaId, hiddenAt, hiddenBy: actorEmail };
	const database = databaseFor(platform);
	if (!database) {
		localHiddenMedia.set(mediaId, state);
		return state;
	}

	await database.batch([
		database
			.prepare(
				"INSERT INTO gallery_hidden_media (media_id, hidden_at, hidden_by) VALUES (?, ?, ?) ON CONFLICT(media_id) DO UPDATE SET hidden_at = excluded.hidden_at, hidden_by = excluded.hidden_by"
			)
			.bind(mediaId, hiddenAt, actorEmail),
		database
			.prepare(
				"INSERT INTO gallery_moderation_events (media_id, action, actor_email, created_at) VALUES (?, 'hide', ?, ?)"
			)
			.bind(mediaId, actorEmail, hiddenAt),
	]);
	return state;
}

export async function restoreGalleryMedia(
	platform: App.Platform | undefined,
	mediaId: string,
	actorEmail: string
): Promise<void> {
	const restoredAt = new Date().toISOString();
	const database = databaseFor(platform);
	if (!database) {
		localHiddenMedia.delete(mediaId);
		return;
	}

	await database.batch([
		database.prepare("DELETE FROM gallery_hidden_media WHERE media_id = ?").bind(mediaId),
		database
			.prepare(
				"INSERT INTO gallery_moderation_events (media_id, action, actor_email, created_at) VALUES (?, 'restore', ?, ?)"
			)
			.bind(mediaId, actorEmail, restoredAt),
	]);
}
