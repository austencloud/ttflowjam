declare global {
	namespace App {
		interface Platform {
			env: {
				TTFJ_MEDIA: R2Bucket;
			};
			context: ExecutionContext;
		}
	}
}

export {};
