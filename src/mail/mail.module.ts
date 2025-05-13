import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailServiceTsService } from './providers/mail.service.ts.service';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('appConfig.mailHost'),
          secure: false,
          port: 2525,
          auth: {
            user: config.get('appConfig.smtpUsername'),
            pass: config.get('appConfig.smtpPassword'),
          },
          default: {
            from: `My Blog <no-preply@nestjs-blog.com>`,
          },
          template: {
            dir: join(__dirname) + 'templates',
            adapter: new EjsAdapter(),
            options: {
              strict: false,
            },
          },
        },
      }),
    }),
  ],
  providers: [MailServiceTsService],
  exports: [MailServiceTsService],
})
export class MailModule {}
