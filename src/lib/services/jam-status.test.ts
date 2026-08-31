import { describe, expect, it } from "vitest";
import { civilDateToIso, formatJamDate, jamStatus, upcomingJamDates } from "./jam-status";

describe("jamStatus", () => {
	it("uses Chicago Tuesday even after UTC has crossed into Wednesday", () => {
		const status = jamStatus(new Date("2026-08-19T02:00:00Z"));
		expect(status.state).toBe("today");
		expect(civilDateToIso(status.nextJam)).toBe("2026-08-18");
	});

	it("moves to the next Tuesday after the jam window closes in Chicago", () => {
		const status = jamStatus(new Date("2026-08-19T03:01:00Z"));
		expect(status.state).toBe("upcoming");
		expect(civilDateToIso(status.nextJam)).toBe("2026-08-25");
	});

	it("finds the first Tuesday in April before the season starts", () => {
		const status = jamStatus(new Date("2026-01-10T18:00:00Z"));
		expect(status.state).toBe("off-season");
		expect(civilDateToIso(status.nextJam)).toBe("2026-04-07");
	});

	it("rolls a finished season into the following April", () => {
		const status = jamStatus(new Date("2026-11-03T18:00:00Z"));
		expect(status.state).toBe("off-season");
		expect(civilDateToIso(status.nextJam)).toBe("2027-04-06");
	});

	it("rolls the final Tuesday night into the following season", () => {
		const status = jamStatus(new Date("2026-10-28T03:01:00Z"));
		expect(status.state).toBe("off-season");
		expect(civilDateToIso(status.nextJam)).toBe("2027-04-06");
	});
});

describe("formatJamDate", () => {
	it("formats date-only values without leaking the machine timezone", () => {
		expect(formatJamDate({ year: 2026, month: 9, day: 1 })).toBe("Tuesday, September 1");
		expect(formatJamDate({ year: 2026, month: 9, day: 1 }, "short")).toBe("Tue, Sep 1");
	});
});

describe("upcomingJamDates", () => {
	it("lists every remaining Tuesday in the current season", () => {
		const dates = upcomingJamDates(new Date("2026-08-31T18:00:00Z"));

		expect(dates.map(civilDateToIso)).toEqual([
			"2026-09-01",
			"2026-09-08",
			"2026-09-15",
			"2026-09-22",
			"2026-09-29",
			"2026-10-06",
			"2026-10-13",
			"2026-10-20",
			"2026-10-27",
		]);
	});

	it("starts with the next season when the jam is off-season", () => {
		const dates = upcomingJamDates(new Date("2026-11-01T18:00:00Z"));

		expect(civilDateToIso(dates[0]!)).toBe("2027-04-06");
		expect(civilDateToIso(dates.at(-1)!)).toBe("2027-10-26");
	});
});
