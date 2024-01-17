import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { kafkaConfig } from '@app/@common/application/config';
import { EmailModule } from '@app/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig],
    }),
    EmailModule,
  ],
})
export class MainModule {}
