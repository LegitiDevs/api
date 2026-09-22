import { GetServerStatsOptions } from "#schemas/services/stats.js";
import { ServerStats } from "#schemas/stats.js";
import { Collection } from "mongodb";

export async function getServerStats(collection: Collection<ServerStats>, { project }: GetServerStatsOptions) {
    return await collection.find({}, { projection: project }).toArray()
}