"use strict";

import packageJson from '../package.json' with { type: "json" };
const VERSION = packageJson.version;
const SCRAPER_URI = process.env.SCRAPER_URI;

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    var scraperData;
    try {
      const scraper = await fetch(SCRAPER_URI);
      scraperData = await scraper.json();
    } catch (e) {
      scraperData = {};
    }
    return { version: VERSION, scraper: scraperData };
  });
}
