import { describe, expect, it } from "vitest";
import { jamStatus, untilJam } from "./jam-status";

// Dates are constructed in local wall-clock terms; the service is a pure
// function of the Date it receives, so tests are timezone-stable.
const d = (iso: string) => new Date(iso);

describe("jamStatus", () => {
	it("is 'on-now' during a Tuesday evening in season", () => {
		const s = jamStatus(d("2026-08-18T18:00:00")); // Tue, August, 6 PM
		expect(s.state).toBe("on-now");
	});

	it("is 'today' on a Tuesday morning in season", () => {
		const s = jamStatus(d("2026-08-18T09:00:00"));
		expect(s.state).toBe("today");
	});

	it("is 'upcoming' on a Wednesday in season, pointing at next Tuesday", () => {
		const s = jamStatus(d("2026-08-19T12:00:00")); // Wed
		expect(s.state).toBe("upcoming");
		expect(s.nextJam.getDay()).toBe(2);
		expect(s.nextJam.getDate()).toBe(25);
	});

	it("is 'off-season' in January and points at the first Tuesday of April", () => {
		const s = jamStatus(d("2026-01-10T12:00:00"));
		expect(s.state).toBe("off-season");
		expect(s.nextJam.getMonth()).toBe(3); // April
		expect(s.nextJam.getDay()).toBe(2);
		expect(s.nextJam.getDate()).toBeLessThanOrEqual(7);
	});

	it("treats a Tuesday after 10 PM as 'upcoming' (tonight's jam is over)", () => {
		const s = jamStatus(d("2026-08-18T23:00:00"));
		expect(s.state).toBe("upcoming");
		expect(s.nextJam.getDate()).toBe(25);
	});

	it("is 'off-season' in November even on a Tuesday", () => {
		const s = jamStatus(d("2026-11-03T18:00:00")); // Tue in November
		expect(s.state).toBe("off-season");
	});
});

describe("untilJam", () => {
	it("counts minutes inside the final hour", () => {
		expect(untilJam(d("2026-08-18T15:35:00"), d("2026-08-18T16:00:00"))).toBe("in 25 minutes");
	});

	it("counts hours inside the final day", () => {
		expect(untilJam(d("2026-08-18T09:00:00"), d("2026-08-18T16:00:00"))).toBe("in about 7 hours");
	});

	it("counts days beyond 24 hours", () => {
		expect(untilJam(d("2026-08-19T12:00:00"), d("2026-08-25T16:00:00"))).toBe("in 6 days");
	});

	it("reports happening now when the moment has passed", () => {
		expect(untilJam(d("2026-08-18T18:00:00"), d("2026-08-18T16:00:00"))).toBe("happening now");
	});
});
