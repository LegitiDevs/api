import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

async function run() {
	try {
		// Worlds collection
		const worlds = mongoclient.db(DB).collection("worlds");
		
		const WORLDS_normalized_name_index = await worlds.createIndex({ normalized_name: "text" });
		console.log(`[worlds] Index created: ${WORLDS_normalized_name_index}`);
		
		const WORLDS_world_uuid_index = await worlds.createIndex({ world_uuid: 1 })
		console.log(`[worlds] Index created: ${WORLDS_world_uuid_index}`);

		// Stats collection
		const stats = mongoclient.db(DB).collection("stats");

		const STATS_timestamp = await stats.createIndex({ timestamp: -1 });
		console.log(`[stats] Index created: ${STATS_timestamp}`);
	} finally {
		await mongoclient.close();
	}
}

run();
