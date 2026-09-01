const galleryMediaRelease = "20260901";

export function galleryMediaUrl(path: string): string {
	return `${path}?v=${galleryMediaRelease}`;
}
