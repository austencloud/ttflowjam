import { describe, expect, it } from "vitest";
import { parseMediaByteRange } from "./media-byte-range";

describe("parseMediaByteRange", () => {
	it("parses bounded and open-ended ranges", () => {
		expect(parseMediaByteRange("bytes=100-199", 1000)).toEqual({ start: 100, end: 199 });
		expect(parseMediaByteRange("bytes=900-", 1000)).toEqual({ start: 900, end: 999 });
	});

	it("clamps ranges that extend beyond the object", () => {
		expect(parseMediaByteRange("bytes=900-1200", 1000)).toEqual({ start: 900, end: 999 });
	});

	it("parses suffix ranges from the end of the object", () => {
		expect(parseMediaByteRange("bytes=-200", 1000)).toEqual({ start: 800, end: 999 });
		expect(parseMediaByteRange("bytes=-1200", 1000)).toEqual({ start: 0, end: 999 });
	});

	it.each([
		["bytes=-0", 1000],
		["bytes=-", 1000],
		["bytes=100-50", 1000],
		["bytes=1000-", 1000],
		["items=0-10", 1000],
		["bytes=0-10", 0],
	])("rejects invalid range %s", (header, size) => {
		expect(parseMediaByteRange(header, size)).toBeNull();
	});
});
