export type JamState = "on-now" | "today" | "upcoming" | "off-season";

export interface JamStatus {
	state: JamState;
	nextJam: Date;
}

// Season runs April through October (months 3–9, zero-indexed).
const SEASON_FIRST_MONTH = 3;
const SEASON_LAST_MONTH = 9;
const JAM_WEEKDAY = 2; // Tuesday
const JAM_START_HOUR = 16; // "4ish"
const JAM_END_HOUR = 22; // "10ish"

function inSeason(date: Date): boolean {
	const m = date.getMonth();
	return m >= SEASON_FIRST_MONTH && m <= SEASON_LAST_MONTH;
}

function firstTuesdayOfApril(year: number): Date {
	const d = new Date(year, SEASON_FIRST_MONTH, 1, JAM_START_HOUR);
	while (d.getDay() !== JAM_WEEKDAY) {
		d.setDate(d.getDate() + 1);
	}
	return d;
}

function nextTuesday(from: Date, includeToday: boolean): Date {
	const d = new Date(from.getFullYear(), from.getMonth(), from.getDate(), JAM_START_HOUR);
	let delta = (JAM_WEEKDAY - d.getDay() + 7) % 7;
	if (delta === 0 && !includeToday) {
		delta = 7;
	}
	d.setDate(d.getDate() + delta);
	return d;
}

export function jamStatus(now: Date): JamStatus {
	if (!inSeason(now)) {
		const year = now.getMonth() > SEASON_LAST_MONTH ? now.getFullYear() + 1 : now.getFullYear();
		return { state: "off-season", nextJam: firstTuesdayOfApril(year) };
	}

	const isJamDay = now.getDay() === JAM_WEEKDAY;
	const hour = now.getHours();

	if (isJamDay && hour >= JAM_START_HOUR && hour < JAM_END_HOUR) {
		return { state: "on-now", nextJam: nextTuesday(now, true) };
	}

	if (isJamDay && hour < JAM_START_HOUR) {
		return { state: "today", nextJam: nextTuesday(now, true) };
	}

	// Tuesday after hours, or any other day: point at the next Tuesday.
	const next = nextTuesday(now, false);
	if (!inSeason(next)) {
		return { state: "off-season", nextJam: firstTuesdayOfApril(next.getFullYear() + 1) };
	}
	return { state: "upcoming", nextJam: next };
}
