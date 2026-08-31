import { describe, expect, it } from "vitest";
import { withGoogleFormJamDate } from "./google-form-jam-date";

describe("withGoogleFormJamDate", () => {
	it("prefills a Google Forms date without dropping existing embed parameters", () => {
		const url = new URL(
			withGoogleFormJamDate("https://docs.google.com/forms/example?embedded=true", "12345", {
				year: 2026,
				month: 9,
				day: 1,
			})
		);

		expect(url.searchParams.get("embedded")).toBe("true");
		expect(url.searchParams.get("entry.12345_year")).toBe("2026");
		expect(url.searchParams.get("entry.12345_month")).toBe("9");
		expect(url.searchParams.get("entry.12345_day")).toBe("1");
	});
});
