import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { ConfigurationInput, Lightship, createLightship } from 'lightship';

import { KafkaServerConfig } from '@core/@shared/infrastructure/config/env';
import { ApiServerConfig } from '@core/@shared/infrastructure/config/env/api-server.config';

import { MainModule } from './main.module';

const logger = new Logger('Main');

async function bootstrap() {
  // const configuration: ConfigurationInput = {
  //   detectKubernetes: ApiServerConfig.ENV !== 'production' ? false : true,
  //   gracefulShutdownTimeout: 30 * 1000,
  //   port: ApiServerConfig.LIGHTSHIP_PORT,
  // };

  // const lightship: Lightship = await createLightship(configuration);

  const app = await NestFactory.create(MainModule);

  // lightship.registerShutdownHandler(() => app.close());

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: {
  //     host: '0.0.0.0',
  //     port: ApiServerConfig.PORT,
  //   },
  // });

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
    // lightship.signalReady();
    logger.log(
      `notification-engine is running in port ${ApiServerConfig.PORT}`,
    );
  });
}

bootstrap();
