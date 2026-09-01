CREATE TABLE IF NOT EXISTS gallery_moderators (
	email TEXT PRIMARY KEY COLLATE NOCASE,
	google_subject TEXT UNIQUE,
	role TEXT NOT NULL CHECK (role IN ('owner', 'moderator')),
	display_name TEXT,
	avatar_url TEXT,
	added_at TEXT NOT NULL,
	added_by TEXT NOT NULL,
	revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS gallery_sessions (
	token_hash TEXT PRIMARY KEY,
	moderator_email TEXT NOT NULL COLLATE NOCASE,
	created_at TEXT NOT NULL,
	expires_at TEXT NOT NULL,
	FOREIGN KEY (moderator_email) REFERENCES gallery_moderators(email) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS gallery_sessions_expiry
	ON gallery_sessions (expires_at);

CREATE INDEX IF NOT EXISTS gallery_sessions_moderator
	ON gallery_sessions (moderator_email);

CREATE TABLE IF NOT EXISTS gallery_moderator_events (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	moderator_email TEXT NOT NULL COLLATE NOCASE,
	action TEXT NOT NULL CHECK (action IN ('add', 'revoke')),
	actor_email TEXT NOT NULL,
	created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS gallery_moderator_events_email
	ON gallery_moderator_events (moderator_email, created_at DESC);
