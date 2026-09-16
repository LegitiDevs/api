import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

async function run() {
	try {
		const worlds = mongoclient.db(DB).collection("worlds");

		const normalized_name_index = await worlds.createIndex({ normalized_name: "text" });
		console.log(`Index created: ${normalized_name_index}`);
	} finally {
		await mongoclient.close();
	}
}

run();
