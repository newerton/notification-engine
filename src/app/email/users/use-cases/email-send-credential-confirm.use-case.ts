import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { Code } from '@core/@shared/domain/error/Code';
import { Exception } from '@core/@shared/domain/exception/Exception';
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

  async execute(input: EmailSendCredentialsConfirmInput): Promise<any> {
    const { userId, actions } = input;

    const baseInternalUrl = KeycloakServerConfig.BASE_INTERNAL_URL;
    const realm = KeycloakServerConfig.REALM;
    const baseUrl = `${baseInternalUrl}/admin/realms/${realm}/users`;
    const url = `${baseUrl}/${userId}/execute-actions-email?lifespan=43200`;

    const { access_token } = await lastValueFrom(
      this.client.send('auth.credentials', {}),
    );

    try {
      const response = await this.httpService.axiosRef.put(url, actions, {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (e) {
      throw Exception.new({
        code: Code.UNAUTHORIZED.code,
        overrideMessage: 'Error sending credentials email',
        data: { originalError: e },
      });
    }
  }
}
