import { Module, forwardRef } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    // HashingProvider is an interface, so we need to provide a concrete implementation
    // BcryptProvider is a concrete implementation of HashingProvider
    { provide: HashingProvider, useClass: BcryptProvider },
    SignInProvider,
  ],
  imports: [forwardRef(() => UsersModule)],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}
