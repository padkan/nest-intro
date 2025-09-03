import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200) // Set HTTP status code to 200 OK
  @Auth(AuthType.None)
  public async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh-tokens')
  @HttpCode(200) // Set HTTP status code to 200 OK
  @Auth(AuthType.None)
  public async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
  @Post('log-in')
  @HttpCode(200) // Set HTTP status code to 200 OK
  @Auth(AuthType.None)
  public async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.signIn(signInDto);
    res.cookie('jwt', jwt.accessToken, {
      httpOnly: true, // 🔐 cannot be accessed via JS
      secure: true, // 🔐 only over HTTPS (set false if local dev without https)
      sameSite: 'strict', // ✅ helps against CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { message: 'Login successful' };
  }
}
