import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { EmailSendCredentialsConfirmInput } from '../dto';
import { EmailSendCredentialsConfirmUseCase } from '../use-cases';

@Controller('email/users')
export class EmailSendCredentialsConfirmController {
  constructor(private readonly useCase: EmailSendCredentialsConfirmUseCase) {}

  @MessagePattern('email.users.send-credential-confirm')
  async create(
    @Payload() payload: EmailSendCredentialsConfirmInput,
  ): Promise<any> {
    return this.useCase.execute(payload);
  }
}
