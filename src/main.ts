import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { KafkaServerConfig } from '@core/@shared/infrastructure/config/env';
import { ApiServerConfig } from '@core/@shared/infrastructure/config/env/api-server.config';

import { MainModule } from './main.module';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification',
        brokers: [
          `${KafkaServerConfig.BROKER_HOST}:${KafkaServerConfig.BROKER_PORT}`,
        ],
      },
      consumer: {
        groupId: 'notification-consumer',
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices().then(() => {
    logger.log(
      `notification-engine is running in port ${ApiServerConfig.PORT}`,
    );
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
