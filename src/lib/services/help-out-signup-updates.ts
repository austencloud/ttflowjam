import type { HelpOutSignup } from "$lib/services/help-out-signups";

export function findNewSignupIds(
	currentSignups: HelpOutSignup[],
	updatedSignups: HelpOutSignup[]
): string[] {
	const currentIds = new Set(currentSignups.map((signup) => signup.id));
	return updatedSignups.filter((signup) => !currentIds.has(signup.id)).map((signup) => signup.id);
}
