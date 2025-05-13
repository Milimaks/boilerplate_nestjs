import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInDto } from './dtos/signin.dto';
import { AuthType } from './enums/auth-type.enum';
import { AuthService } from './providers/auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';
import { GoogleTokenDto } from './social/dtos/google-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    /*
     * Injecting Auth Service
     */
    private readonly authService: AuthService,
    /**
     * Inject googleAuthenticationService
     */
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshTokens(refreshTokenDto);
  }
}
