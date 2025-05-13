import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { GenerateTokenProvider } from './generate-token.provider';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Injecting usersService
     * This is a forward reference to avoid circular dependency issues.
     * The AuthService depends on UsersService, and vice versa.
     * By using forwardRef, we can inject the UsersService without causing a circular dependency.
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Inject hashingProvider
     */
    private readonly hashingProvider: HashingProvider,
    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokenProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    // Find user using email ID
    // Throw an exception user not found
    let user = await this.usersService.findOneByEmail(signInDto.email);
    // Compare password to the hashed password
    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }
    if (!isEqual) {
      // Throw exception if password is not valid
      throw new UnauthorizedException('Invalid password');
    }

    // generate refresh token and access token
    return await this.generateTokensProvider.generateTokens(user);
  }
}
