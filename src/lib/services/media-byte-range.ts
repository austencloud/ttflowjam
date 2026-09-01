export interface MediaByteRange {
	start: number;
	end: number;
}

export function parseMediaByteRange(rangeHeader: string, size: number): MediaByteRange | null {
	if (!Number.isSafeInteger(size) || size <= 0) {
		return null;
	}

	const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
	if (!match || (!match[1] && !match[2])) {
		return null;
	}

	if (!match[1]) {
		const requestedLength = Number(match[2]);
		if (!Number.isSafeInteger(requestedLength) || requestedLength <= 0) {
			return null;
		}

		const length = Math.min(requestedLength, size);
		return { start: size - length, end: size - 1 };
	}

	const start = Number(match[1]);
	const end = match[2] ? Number(match[2]) : size - 1;
	if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
		return null;
	}

	return { start, end: Math.min(end, size - 1) };
}
