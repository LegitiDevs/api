import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

async function run() {
	try {
		const worlds = mongoclient.db(DB).collection("worlds");

        const indexes_to_remove = [
            'name_text', // Removed in API v4
            'last_scraped_ms'
        ]

        const indexes = await worlds.indexes()

        for (const index_name of indexes_to_remove) {
            if (indexes.some(v => v.name === index_name)) {
                console.log(`Found ${index_name}. Removing.`)
                const result = await worlds.dropIndex(index_name)
                return result
            }

        }
	} finally {
		await mongoclient.close();
	}
}

run();
