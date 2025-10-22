import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KeycloakConnectModule } from 'nest-keycloak-connect';

import {
  ApiServerConfig,
  KafkaServerConfig,
  KeycloakServerConfig,
} from '@core/@shared/infrastructure/config/env';

import { EmailSendCredentialsConfirmController } from './controllers';
import { EmailSendCredentialsConfirmUseCase } from './use-cases';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: ApiServerConfig.AUTH_ENGINE_PORT,
        },
      },
      {
        name: 'NOTIFICATION_SERVICE_KAFKA',
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
      },
    ]),
    KeycloakConnectModule.register({
      authServerUrl: KeycloakServerConfig.BASE_INTERNAL_URL,
      realm: KeycloakServerConfig.REALM,
      clientId: KeycloakServerConfig.API_GATEWAY_CLIENT_ID,
      secret: KeycloakServerConfig.API_GATEWAY_SECRET,
    }),
  ],
  controllers: [EmailSendCredentialsConfirmController],
  providers: [EmailSendCredentialsConfirmUseCase],
})
export class UsersModule {}
