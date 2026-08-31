import type { CivilDate } from "./jam-status";

export function withGoogleFormJamDate(formUrl: string, entryId: string, date: CivilDate): string {
	const url = new URL(formUrl);
	const entry = `entry.${entryId}`;

	url.searchParams.set(`${entry}_year`, String(date.year));
	url.searchParams.set(`${entry}_month`, String(date.month));
	url.searchParams.set(`${entry}_day`, String(date.day));

	return url.toString();
}
