// Read the .env file.
try {
	process.loadEnvFile();
} catch {}

// Require the framework
import Fastify from "fastify";

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from "close-with-grace";

// Instantiate Fastify with some config
function getLoggerOptions () {
  // Only if the program is running in an interactive terminal
  if (process.stdout.isTTY) {
    return {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    }
  }

  return { level: process.env.LOG_LEVEL ?? 'silent' }
}

const app = Fastify({
	logger: getLoggerOptions(),
});

// Register your application as a normal plugin.
import appService from "./app.ts";
app.register(appService);

// delay is the number of milliseconds for the graceful close to finish
closeWithGrace(
	{ delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 },
	async function ({ signal, err, manual }) {
		if (err) {
			app.log.error(err);
		}
		await app.close();
	},
);

// Start listening.
app.listen({ port: process.env.PORT || 3000 }, (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
