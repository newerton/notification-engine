import { kafkaConfig } from '@app/@common/application/config';
import { EmailModule } from '@app/email/email.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
