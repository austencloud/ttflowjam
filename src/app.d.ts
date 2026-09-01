import type { D1Database } from "@cloudflare/workers-types";

declare global {
	namespace App {
		interface Platform {
			env: {
				GOOGLE_CLIENT_ID?: string;
				GALLERY_OWNER_EMAIL?: string;
				TTFJ_MEDIA: R2Bucket;
				TTFJ_MODERATION: D1Database;
			};
			context: ExecutionContext;
		}
	}
}

export {};
