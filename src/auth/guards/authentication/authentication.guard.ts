import { AccessTokenGuard } from './../access-token/access-token.guard';
import { AccessTokenCookieGuard } from './../access-token-cookie/access-token-cookie.guard';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthType } from '../../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private readonly authTypeGuardMap: Record<AuthType, CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly accessTokenCookieGuard: AccessTokenCookieGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: [this.accessTokenGuard],
      [AuthType.None]: [{ canActivate: () => true }],
      [AuthType.Cookie]: [this.accessTokenCookieGuard],
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // authtype from reflector
    const authType = this.reflector.getAllAndOverride<AuthType | AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];
    // array of guards
    const guards = Array.isArray(authType)
      ? authType.flatMap((type) => this.authTypeGuardMap[type])
      : this.authTypeGuardMap[authType];

    // default error user not
    const error = new UnauthorizedException();
    //loop guards canActivate
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch(() => false);

      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
