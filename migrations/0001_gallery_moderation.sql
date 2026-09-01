CREATE TABLE IF NOT EXISTS gallery_hidden_media (
	media_id TEXT PRIMARY KEY,
	hidden_at TEXT NOT NULL,
	hidden_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS gallery_moderation_events (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	media_id TEXT NOT NULL,
	action TEXT NOT NULL CHECK (action IN ('hide', 'restore')),
	actor_email TEXT NOT NULL,
	created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS gallery_moderation_events_media_id
	ON gallery_moderation_events (media_id, created_at DESC);

