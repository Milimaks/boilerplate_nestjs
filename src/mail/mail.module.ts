import { Module } from '@nestjs/common';
import { MailServiceTsService } from './providers/mail.service.ts.service';

@Module({
  providers: [MailServiceTsService]
})
export class MailModule {}
