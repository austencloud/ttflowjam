import { siteDetails } from "$lib/data/site-details";
import { parseHelpOutSignups } from "$lib/services/help-out-signups";
import { civilDateToIso, formatJamDate, upcomingJamDates } from "$lib/services/jam-status";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({
		"cache-control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
	});

	const jamDates = upcomingJamDates(new Date()).map((date) => ({
		date,
		iso: civilDateToIso(date),
		label: `${formatJamDate(date)}, ${date.year}`,
		shortLabel: formatJamDate(date, "short"),
	}));

	try {
		const response = await fetch(siteDetails.helpOutResponsesCsvUrl, {
			headers: { accept: "text/csv" },
		});

		if (!response.ok) {
			throw new Error(`Google Sheets returned ${response.status}.`);
		}

		return {
			jamDates,
			signups: parseHelpOutSignups(await response.text()),
			signupsAvailable: true,
		};
	} catch (error) {
		console.error("Could not load the public help-out signups.", error);

		return {
			jamDates,
			signups: [],
			signupsAvailable: false,
		};
	}
};
