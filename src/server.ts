import config from "config";
import app from "./app";
import logger from "./config/logger";
import { initDb } from "./config/db";

const startServer = async () => {
    const PORT = config.get<number>("server.port") || 5502;
    try {
        await initDb();

        logger.info("Connected to the database");

        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message);
            logger.on("finish", () => {
                process.exit(1);
            });
        }
    }
};

void startServer();
