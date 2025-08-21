import { HashingProvider } from 'src/auth/providers/hashing.provider';
import {
  Inject,
  Injectable,
  RequestTimeoutException,
  forwardRef,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    /**
     * inject jwt service
     */
    private readonly jwtService: JwtService,
    /**
     * inject jwt config
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  public async signIn(signInDto: SignInDto) {
    let user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new RequestTimeoutException('User not found');
    }
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException('Error comparing passwords');
    }
    if (!isEqual) {
      throw new RequestTimeoutException('Invalid credentials');
    }
    const accessToken = await this.jwtService.signAsync(
      {
        email: user.email,
        sub: user.id,
      },
      {
        audience: this.jwtConfiguration.audience,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      },
    );

    return {
      accessToken,
    };
  }
}
