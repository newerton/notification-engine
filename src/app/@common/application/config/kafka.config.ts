import { KafkaServerConfig } from '@core/@shared/infrastructure/config/env';

export const kafkaConfig = () => ({
  kafka: {
    brokers: `${KafkaServerConfig.BROKER_HOST}:${KafkaServerConfig.BROKER_PORT}`,
  },
});
