"use strict";

import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const plugin: FastifyPluginAsyncTypebox<{ apiVersion: string }> = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    let scraperData;
    try {
      const scraper = await fastify.legitidevs_scraper.fetch('');
      scraperData = await scraper.json();
    } catch (e) {
      scraperData = {_message: "The scraper is currently unavailable."};
    }

    return { version: opts.apiVersion, _message: "v3 is deprecated! Please try migrating to v4 immediately. v3 will be removed soon.", scraper: scraperData };
  });
}

export default plugin