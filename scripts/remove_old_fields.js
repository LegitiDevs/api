import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

async function run() {
	try {
		const worlds = mongoclient.db(DB).collection("worlds");

		await worlds.updateMany({}, { 
            $unset: { 
                "jam_id": 1, // Removed in API v4
                "jam_world": 1, // Removed in API v4
                "legitidevs": 1, // Removed in API v4
                "legitidevs.comments": 1, // Removed in API v4
                "legitidevs.description": 1, // Removed in API v4
                "legitidevs.unlisted": 1, // Removed in API v4
            } 
        })
	} finally {
		await mongoclient.close();
	}
}

run();
