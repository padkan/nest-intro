import {
  Injectable,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import type { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
     * inject jwt service
     */
    private readonly jwtService: JwtService,
    /**
     * inject jwt config
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
     * inject generate tokens provider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify the refresh token using jwtService
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      // fetch user from DB using sub
      const user = await this.usersService.findOneById(sub);

      // Generate the token
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid refresh token');
    }
  }
}
