import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { KeycloakUseCaseException } from '@core/@shared/infrastructure/adapter/identify-and-access/keycloak/exception/keycloak-error.exception';
import { KeycloakServerConfig } from '@core/@shared/infrastructure/config/env';

import { EmailSendCredentialsConfirmInput } from '../dto';

@Injectable()
export class EmailSendCredentialsConfirmUseCase {
  logger: Logger = new Logger(EmailSendCredentialsConfirmUseCase.name);

  constructor(
    @Inject('AUTH_SERVICE')
    private readonly client: ClientProxy,

    private readonly httpService: HttpService,
  ) {}

  async execute(input: EmailSendCredentialsConfirmInput): Promise<void> {
    const { userId, actions } = input;

    const baseInternalUrl = KeycloakServerConfig.BASE_INTERNAL_URL;
    const realm = KeycloakServerConfig.REALM;
    const baseUrl = `${baseInternalUrl}/admin/realms/${realm}/users`;
    const url = `${baseUrl}/${userId}/execute-actions-email?lifespan=43200`;

    const { access_token } = await lastValueFrom(
      this.client.send('auth.credentials', {}),
    );

    return this.httpService.axiosRef
      .put(url, actions, {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => response.data)
      .catch((e) => new KeycloakUseCaseException(e));
    // .catch(() =>
    //   this.logger.error(
    //     `E-mail not sent to userId ${userId} and actions ${actions}`,
    //   ),
    // )
  }
}
