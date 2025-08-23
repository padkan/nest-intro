import { HashingProvider } from 'src/auth/providers/hashing.provider';
import {
  Inject,
  Injectable,
  RequestTimeoutException,
  forwardRef,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    if (!signInDto.password) {
      throw new RequestTimeoutException('Password is required');
    }
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user || !user.password) {
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

    return await this.generateTokensProvider.generateTokens(user);
  }
}
