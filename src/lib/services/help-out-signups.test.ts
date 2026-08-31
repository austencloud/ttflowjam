import { describe, expect, it } from "vitest";
import { findNewSignupIds } from "./help-out-signup-updates";
import { parseHelpOutSignups } from "./help-out-signups";

describe("parseHelpOutSignups", () => {
	it("maps public form responses and shows the newest signup first", () => {
		const csv = [
			"Timestamp,Name or handle,Helping with,What are you bringing?,Jam date",
			'8/30/2026 16:20:00,Alex,"Set up, Clean up","Pico de gallo, chips",9/1/2026',
			"8/30/2026 16:21:00,Sam,Bringing something,Plates,9/8/2026",
		].join("\n");

		expect(parseHelpOutSignups(csv)).toEqual([
			{
				id: "8/30/2026 16:21:00\u001fSam\u001fBringing something\u001fPlates\u001f9/8/2026",
				name: "Sam",
				helpingWith: ["Bringing something"],
				bringing: "Plates",
				jamDate: "2026-09-08",
			},
			{
				id: "8/30/2026 16:20:00\u001fAlex\u001fSet up, Clean up\u001fPico de gallo, chips\u001f9/1/2026",
				name: "Alex",
				helpingWith: ["Set up", "Clean up"],
				bringing: "Pico de gallo, chips",
				jamDate: "2026-09-01",
			},
		]);
	});

	it("rejects an unexpected response-sheet shape", () => {
		expect(() => parseHelpOutSignups("Timestamp,Name\n")).toThrow(
			"The help-out response sheet columns changed."
		);
	});

	it("finds a newly submitted response even when its visible details match an older one", () => {
		const existing = parseHelpOutSignups(
			[
				"Timestamp,Name or handle,Helping with,What are you bringing?,Jam date",
				"8/30/2026 16:20:00,Alex,Set up,Chips,9/1/2026",
			].join("\n")
		);
		const updated = parseHelpOutSignups(
			[
				"Timestamp,Name or handle,Helping with,What are you bringing?,Jam date",
				"8/30/2026 16:20:00,Alex,Set up,Chips,9/1/2026",
				"8/30/2026 16:22:00,Alex,Set up,Chips,9/1/2026",
			].join("\n")
		);

		expect(findNewSignupIds(existing, updated)).toEqual([updated[0]!.id]);
	});

	it("keeps older undated rows unassigned instead of guessing a week", () => {
		const signups = parseHelpOutSignups(
			[
				"Timestamp,Name or handle,Helping with,What are you bringing?,Jam date",
				"8/30/2026 16:20:00,Alex,Set up,Chips,",
			].join("\n")
		);

		expect(signups[0]?.jamDate).toBeNull();
	});
});
