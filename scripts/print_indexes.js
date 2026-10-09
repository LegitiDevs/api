import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

async function run() {
    try {
        const worlds = mongoclient.db(DB).collection("worlds");
        const stats = mongoclient.db(DB).collection("stats");
        const players = mongoclient.db(DB).collection("players");

        console.log("-------------------- Worlds Indexes")
        console.log(await worlds.indexes())

        console.log("-------------------- Stats Indexes")
        console.log(await stats.indexes())

        console.log("-------------------- Players Indexes")
        console.log(await players.indexes())
    } finally {
        await mongoclient.close();
    }
}

run()
