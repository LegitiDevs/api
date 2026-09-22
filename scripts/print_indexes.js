import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

async function run() {
    try {
        const worlds = mongoclient.db(DB).collection("worlds");

        console.log(await worlds.indexes())
    } finally {
        await mongoclient.close();
    }
}

run()
