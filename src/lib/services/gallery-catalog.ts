import manifest from "$lib/data/gallery-manifest.json";

export type GalleryMediaType = "photo" | "video" | "raw-photo" | "animation";

export interface GalleryMediaRecord {
	id: string;
	w: number;
	h: number;
	year: number;
	type: GalleryMediaType;
}

export const galleryMedia = manifest as GalleryMediaRecord[];

const galleryMediaById = new Map(galleryMedia.map((media) => [media.id, media]));

export function hasGalleryMedia(mediaId: string): boolean {
	return galleryMediaById.has(mediaId);
}
