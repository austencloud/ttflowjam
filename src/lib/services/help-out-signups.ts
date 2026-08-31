import { parse } from "csv-parse/sync";

const expectedHeaders = [
	"Timestamp",
	"Name or handle",
	"Helping with",
	"What are you bringing?",
	"Jam date",
] as const;

interface HelpOutCsvRow {
	Timestamp?: string;
	"Name or handle"?: string;
	"Helping with"?: string;
	"What are you bringing?"?: string;
	"Jam date"?: string;
}

export interface HelpOutSignup {
	id: string;
	name: string;
	helpingWith: string[];
	bringing: string;
	jamDate: string | null;
}

function isCivilDate(year: number, month: number, day: number): boolean {
	const candidate = new Date(Date.UTC(year, month - 1, day));
	return (
		candidate.getUTCFullYear() === year &&
		candidate.getUTCMonth() === month - 1 &&
		candidate.getUTCDate() === day
	);
}

function toIsoDate(year: number, month: number, day: number): string | null {
	if (!isCivilDate(year, month, day)) {
		return null;
	}

	return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function normalizeJamDate(value: string | undefined): string | null {
	const date = value?.trim();
	if (!date) {
		return null;
	}

	const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(date);
	if (iso) {
		return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));
	}

	const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s|$)/.exec(date);
	if (us) {
		return toIsoDate(Number(us[3]), Number(us[1]), Number(us[2]));
	}

	return null;
}

function createSignupId(row: HelpOutCsvRow): string {
	return [
		row.Timestamp?.trim() ?? "",
		row["Name or handle"]?.trim() ?? "",
		row["Helping with"]?.trim() ?? "",
		row["What are you bringing?"]?.trim() ?? "",
		row["Jam date"]?.trim() ?? "",
	].join("\u001f");
}

export function parseHelpOutSignups(csv: string): HelpOutSignup[] {
	const [headers] = parse(csv, {
		bom: true,
		skip_empty_lines: true,
		to_line: 1,
		trim: true,
	}) as string[][];

	if (!headers || expectedHeaders.some((header, index) => headers[index] !== header)) {
		throw new Error("The help-out response sheet columns changed.");
	}

	const rows = parse(csv, {
		bom: true,
		columns: true,
		skip_empty_lines: true,
		trim: true,
	}) as HelpOutCsvRow[];

	return rows
		.map((row) => ({
			id: createSignupId(row),
			name: row["Name or handle"]?.trim() ?? "",
			helpingWith: (row["Helping with"] ?? "")
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean),
			bringing: row["What are you bringing?"]?.trim() ?? "",
			jamDate: normalizeJamDate(row["Jam date"]),
		}))
		.filter((signup) => signup.name)
		.reverse();
}
