import config from 'config';
import app from './app';
import logger from './Config/logger';
import { initDb } from './Config/db';
import { MessageProducerBroker } from './common/types/broker';
import { createMessageProducerBroker } from './common/factories/brokerFactory';

const startServer = async () => {
  const PORT = config.get<number>('server.port') || 5502;
  let messageProducerBroker: MessageProducerBroker | null = null;
  try {
    await initDb();

    logger.info('Connected to the database');

    //connect to kafka

    messageProducerBroker = createMessageProducerBroker();
    await messageProducerBroker.connect();

    app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (messageProducerBroker) {
        await messageProducerBroker.disconnect();
      }
      logger.error(err.message);
      logger.on('finish', () => {
        process.exit(1);
      });
    }
  }
};

void startServer();
