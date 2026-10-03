"use strict";

import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const plugin: FastifyPluginAsyncTypebox<{ apiVersion: string }> = async function (fastify, opts) {
  fastify.get(
    "/", 
    { schema: { hide: true } },
    async function (request, reply) {
      let scraperData;
      try {
        const scraper = await fastify.legitidevs_scraper.fetch('');
        scraperData = await scraper.json();
      } catch (e) {
        scraperData = {_message: "The scraper is currently unavailable."};
      }

      return { version: opts.apiVersion, scraper: scraperData };
    });
}

export default plugin