import { GenerateTokensProvider } from './../../providers/generate-tokens.provider';
import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config/dist/types/config.type';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google.token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient!: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authentication(googleTokenDto: GoogleTokenDto) {
    // verify the google token sent by user
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: googleTokenDto.token,
    });
    // Extract the payload from google JWT
    const payload = loginTicket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const {
      email,
      sub: googleId,
      given_name: firstName,
      family_name: lastName,
    } = payload;
    if (!email || !googleId) {
      throw new UnauthorizedException('Invalid Google token payload');
    }
    // find user based on googleId
    const user = await this.usersService.findOneByGoogleId(googleId);
    // if googleId exists in database then generate JWT
    if (user) {
      return this.generateTokensProvider.generateTokens(user);
    }
    // if the user with this googleId does not exist then create a new user
    const newUser = await this.usersService.createGoogleUser({
      email,
      googleId,
      firstName: firstName || '',
      lastName: lastName || '',
    });

    return this.generateTokensProvider.generateTokens(newUser);
    // throw UnauthorizedException if token is invalid
  }
}
