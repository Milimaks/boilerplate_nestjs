import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokenProvider } from 'src/auth/providers/generate-token.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;
  constructor(
    /**
     * Inject usersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Inject JwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokenProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // verify the Google Token sent by User
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      // Extract the payload from the token
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();
      // Find the user in the database using the Google ID
      const user = await this.usersService.findOneByGoogleId(googleId);
      // If user is found, generate the access token and refresh token
      if (user) {
        return this.generateTokensProvider.generateTokens(user);
      }
      // If user is not found, create a new user in the database and generate the token
      const newUser = await this.usersService.createGoogleUser({
        email,
        googleId,
        firstName,
        lastName,
      });
      return this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      // Throw Unauthorized exception if the token is invalid
      throw new UnauthorizedException('Invalid Google token', error.message);
    }
  }
}
