"use strict";

import { z } from 'zod/v4';
import packageJson from '../package.json' with {type:"json"}
const VERSION = packageJson.version

/**
 * 
 * @param {import('fastify').FastifyInstance} fastify  
 */
export default async function (fastify, opts) {
  fastify.get("/"/**, {
    schema: {
      response: {
        200: z.object({
          version: z.string(),
          _message: z.string().optional()
        })
      }
    }
  }*/, async function (request, reply) {
    return { version: VERSION, _message: "v3 is deprecated! Please try migrating to v4 immediately. v3 will be removed soon." };
  });
}
