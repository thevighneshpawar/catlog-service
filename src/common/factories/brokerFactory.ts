import config from 'config';
import { KafkaProducerBroker } from '../../Config/kafka';
import { MessageProducerBroker } from '../types/broker';

let messageProducer: MessageProducerBroker | null = null;

export const createMessageProducerBroker = (): MessageProducerBroker => {
  // making singletone

  // Use a proper logging mechanism instead of console.log

  if (!messageProducer) {
    messageProducer = new KafkaProducerBroker(
      'catalog-service',
      config.get('kafka.broker'),
    );
  }

  return messageProducer;
};
