export type JamState = "today" | "upcoming" | "off-season";

export interface CivilDate {
	year: number;
	month: number;
	day: number;
}

export interface JamStatus {
	state: JamState;
	today: CivilDate;
	nextJam: CivilDate;
}

const CHICAGO_TIME_ZONE = "America/Chicago";
const SEASON_FIRST_MONTH = 4;
const SEASON_LAST_MONTH = 10;
const JAM_WEEKDAY = 2;
const JAM_END_HOUR = 22;

const chicagoClock = new Intl.DateTimeFormat("en-US", {
	timeZone: CHICAGO_TIME_ZONE,
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	hourCycle: "h23",
});

function chicagoParts(date: Date): CivilDate & { hour: number } {
	const parts = chicagoClock.formatToParts(date);
	const read = (type: Intl.DateTimeFormatPartTypes): number => {
		const part = parts.find((candidate) => candidate.type === type);
		if (!part) {
			throw new Error(`Chicago clock did not return a ${type} part`);
		}
		return Number(part.value);
	};

	return {
		year: read("year"),
		month: read("month"),
		day: read("day"),
		hour: read("hour"),
	};
}

function asUtcDate(date: CivilDate): Date {
	return new Date(Date.UTC(date.year, date.month - 1, date.day, 12));
}

function fromUtcDate(date: Date): CivilDate {
	return {
		year: date.getUTCFullYear(),
		month: date.getUTCMonth() + 1,
		day: date.getUTCDate(),
	};
}

function addDays(date: CivilDate, days: number): CivilDate {
	const result = asUtcDate(date);
	result.setUTCDate(result.getUTCDate() + days);
	return fromUtcDate(result);
}

function inSeason(date: CivilDate): boolean {
	return date.month >= SEASON_FIRST_MONTH && date.month <= SEASON_LAST_MONTH;
}

function isTuesday(date: CivilDate): boolean {
	return asUtcDate(date).getUTCDay() === JAM_WEEKDAY;
}

function nextTuesday(date: CivilDate, includeToday: boolean): CivilDate {
	const weekday = asUtcDate(date).getUTCDay();
	let delta = (JAM_WEEKDAY - weekday + 7) % 7;
	if (delta === 0 && !includeToday) {
		delta = 7;
	}
	return addDays(date, delta);
}

function firstTuesdayOfApril(year: number): CivilDate {
	return nextTuesday({ year, month: SEASON_FIRST_MONTH, day: 1 }, true);
}

export function jamStatus(now: Date): JamStatus {
	const chicago = chicagoParts(now);
	const today = { year: chicago.year, month: chicago.month, day: chicago.day };

	if (!inSeason(today)) {
		const year = today.month > SEASON_LAST_MONTH ? today.year + 1 : today.year;
		return { state: "off-season", today, nextJam: firstTuesdayOfApril(year) };
	}

	if (isTuesday(today) && chicago.hour < JAM_END_HOUR) {
		return { state: "today", today, nextJam: today };
	}

	const nextJam = nextTuesday(today, false);
	if (!inSeason(nextJam)) {
		return { state: "off-season", today, nextJam: firstTuesdayOfApril(today.year + 1) };
	}

	return { state: "upcoming", today, nextJam };
}

export function formatJamDate(date: CivilDate, style: "short" | "long" = "long"): string {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: "UTC",
		weekday: style === "long" ? "long" : "short",
		month: style === "long" ? "long" : "short",
		day: "numeric",
	}).format(asUtcDate(date));
}

export function civilDateToIso(date: CivilDate): string {
	return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}
