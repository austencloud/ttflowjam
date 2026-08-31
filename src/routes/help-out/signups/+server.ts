import { json } from "@sveltejs/kit";
import { siteDetails } from "$lib/data/site-details";
import { parseHelpOutSignups } from "$lib/services/help-out-signups";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const response = await fetch(siteDetails.helpOutResponsesCsvUrl, {
			cache: "no-store",
			headers: { accept: "text/csv" },
		});

		if (!response.ok) {
			throw new Error(`Google Sheets returned ${response.status}.`);
		}

		return json(
			{
				signups: parseHelpOutSignups(await response.text()),
			},
			{
				headers: { "cache-control": "no-store" },
			}
		);
	} catch (error) {
		console.error("Could not refresh the public help-out signups.", error);
		return json({ signups: [] }, { status: 502, headers: { "cache-control": "no-store" } });
	}
};
