export interface GoogleCredentialResponse {
	credential: string;
	select_by?: string;
}

export interface GoogleIdentityApi {
	initialize(config: {
		client_id: string;
		callback: (response: GoogleCredentialResponse) => void;
		auto_select?: boolean;
		cancel_on_tap_outside?: boolean;
		context?: "signin" | "signup" | "use";
		itp_support?: boolean;
	}): void;
	renderButton(
		parent: HTMLElement,
		options: {
			type: "standard";
			theme: "outline" | "filled_blue" | "filled_black";
			size: "large" | "medium" | "small";
			shape: "rectangular" | "pill" | "circle" | "square";
			text: "signin_with" | "signup_with" | "continue_with" | "signin";
			logo_alignment: "left" | "center";
			width?: number;
		}
	): void;
	prompt(): void;
	cancel(): void;
	disableAutoSelect(): void;
}

declare global {
	interface Window {
		google?: { accounts?: { id?: GoogleIdentityApi } };
	}
}

let loading: Promise<GoogleIdentityApi> | null = null;

export function loadGoogleIdentity(): Promise<GoogleIdentityApi> {
	if (window.google?.accounts?.id) {
		return Promise.resolve(window.google.accounts.id);
	}
	if (loading) {
		return loading;
	}

	const pending = new Promise<GoogleIdentityApi>((resolve, reject) => {
		const finish = () => {
			const api = window.google?.accounts?.id;
			if (api) {
				resolve(api);
			} else {
				reject(new Error("Google Identity Services did not initialize."));
			}
		};
		const fail = () => reject(new Error("Google Identity Services did not load."));
		const existing = document.querySelector<HTMLScriptElement>(
			'script[src="https://accounts.google.com/gsi/client"]'
		);
		if (existing) {
			existing.addEventListener("load", finish, { once: true });
			existing.addEventListener("error", fail, { once: true });
			return;
		}

		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.onload = finish;
		script.onerror = fail;
		document.head.appendChild(script);
	}).catch((cause) => {
		loading = null;
		throw cause;
	});
	loading = pending;

	return pending;
}

export async function disableGoogleAutoSelect(): Promise<void> {
	const google = await loadGoogleIdentity();
	google.disableAutoSelect();
}
