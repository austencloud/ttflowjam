import { describe, expect, it } from "vitest";
import { parseGalleryMediaKey } from "./gallery-media";

describe("parseGalleryMediaKey", () => {
	it.each([
		["thumb/38faa9921878369d.webp", "38faa9921878369d", false],
		["preview/38faa9921878369d.webp", "38faa9921878369d", false],
		["full/38faa9921878369d.webp", "38faa9921878369d", false],
		["video/38faa9921878369d.mp4", "38faa9921878369d", true],
	])("accepts %s", (key, mediaId, isVideo) => {
		expect(parseGalleryMediaKey(key)).toEqual({ key, mediaId, isVideo });
	});

	it.each([
		"thumb/not-an-id.webp",
		"thumb/38faa9921878369d.jpg",
		"../gallery-manifest.json",
		"video/38faa9921878369d.webp",
	])("rejects %s", (key) => {
		expect(parseGalleryMediaKey(key)).toBeNull();
	});
});
