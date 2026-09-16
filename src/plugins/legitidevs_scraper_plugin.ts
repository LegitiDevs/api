import { FastifyInstance } from "fastify";
import fp from "fastify-plugin"

declare module 'fastify' {
    interface FastifyInstance {
        legitidevs_scraper: {
            scraper_uri: URL,
            fetch: (input: string) => Promise<Response>
        }
    }
}

type LegitiDevsScraperPluginOpts = {
    scraper_uri: string
}

async function LegitiDevsScraperPlugin(fastify: FastifyInstance, opts: LegitiDevsScraperPluginOpts) {
    const scraper_uri = new URL(opts.scraper_uri)

    fastify.decorate('legitidevs_scraper', {
        scraper_uri,
        fetch: (input: string) => {
            const fixed_input = input.startsWith('/') ? input : `/${input}`
            return fetch(scraper_uri.origin + fixed_input)
        }
    })
} 

export default fp(LegitiDevsScraperPlugin)