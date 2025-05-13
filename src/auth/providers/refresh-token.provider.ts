import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { GenerateTokenProvider } from './generate-token.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokenProvider {
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
     * Injecting JWTService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokenProvider,
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token using jwtService
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
      });
      // Fetch user from the database
      const user = await this.usersService.findOneById(sub);
      // Generate the tokens
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      // Handle the error if the token is invalid or expired
      throw new UnauthorizedException(error);
    }
  }
}
