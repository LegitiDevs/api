declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      LOG_LEVEL: string;
      FASTIFY_CLOSE_GRACE_DELAY: number;
      MONGO_URI: string;
      SCRAPER: string;
      DB: string;
    }
  }
}

export {}