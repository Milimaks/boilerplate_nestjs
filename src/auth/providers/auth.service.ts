import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { Sign } from 'crypto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Inject signingProvider
     */
    private readonly signingProvider: SignInProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    return await this.signingProvider.signIn(signInDto);
  }

  public isAuth() {
    return true;
  }
}
