import "dotenv/config";
import { MongoClient } from "mongodb";

const CONFIG = {
	MILLISECONDS_TIL_NEXT_FETCH: 900000,
	MAX_LENGTH_UNTIL_DATA_REMOVAL: 100,
};

// type uptime = { status: 0 "good" | 1 "warning" | 2 "bad", time: unix timestamp }
let CHECKING_INTERVAL;
const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");
const status = mongoclient.db(DB).collection("status");

const initialDocument = {
	scraper_uptime: [],
};

export async function main() {
	console.log("Started checkStatus.main");
	if (CHECKING_INTERVAL) {
		clearInterval(CHECKING_INTERVAL);
	}

	const existingDocument = await status.findOne({});
	if (!existingDocument) {
		await status.insertOne(initialDocument);
	}

	await checkStatus();
	CHECKING_INTERVAL = setInterval(
		async () => await checkStatus(),
		CONFIG.MILLISECONDS_TIL_NEXT_FETCH
	);
}

async function checkStatus() {
	console.log(`Checking status... (${Date.now()})`);
	await status.updateOne(
		{},
		{
			$push: {
				scraper_uptime: {
					$each: [await checkScraperStatus()],
					$slice: -CONFIG.MAX_LENGTH_UNTIL_DATA_REMOVAL,
				},
			},
		}
	);
	console.log(`Successfully checked! (${Date.now()})`);
}

async function checkScraperStatus() {
	const query = { scraper_uptime: { $exists: true } };
	const projection = {
		_id: 0,
		lastScraperUptime: { $last: "$scraper_uptime" },
	};
	const scraperUptimeResult = await status
		.aggregate([{ $match: query }, { $project: projection }])
		.toArray();
	const scraperUptime =
		scraperUptimeResult.length > 0
			? scraperUptimeResult[0].lastScraperUptime
			: null;
	const oneWorld = await worlds.findOne({});
	if (oneWorld === undefined) {
		// TODO: Better return
		return 0;
	}
	const current_last_scraped = oneWorld.last_scraped;
	const last_status = scraperUptime;
	let uptime = {
		status: 0,
		last_scraped: current_last_scraped,
		fetchTries: last_status ? last_status.fetchTries : 0,
		time: Date.now(),
	};
	// If there's no last scraped entry on status data 🟢
	if (!last_status) return uptime;
	// If db last scraped does not equal our last scraped 🟢
	if (current_last_scraped != last_status.last_scraped) {
		uptime.fetchTries = 0;
		return uptime;
	}
	if (current_last_scraped == last_status.last_scraped) {
		uptime.fetchTries++;
		// If db last scraped is equal to our last scraped, maybe we checked too early 🟡
		if (uptime.fetchTries == 1) {
			uptime.status = 1;
			// If db last scraped still is equal to our last scraped 😱
		} else if (uptime.fetchTries > 1) {
			uptime.status = 2;
		}
		return uptime;
	}
}
