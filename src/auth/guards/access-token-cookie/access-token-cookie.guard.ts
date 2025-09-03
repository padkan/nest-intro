import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { Logger } from 'winston';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class AccessTokenCookieGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtCfg: ConfigType<typeof jwtConfig>,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  private redact(token?: string) {
    if (!token) return token;
    // show only start/end to avoid leaking secrets
    return token.length > 16
      ? `${token.slice(0, 6)}...${token.slice(-6)}`
      : '***redacted***';
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    // 1) Request context
    const { method, url, headers } = req;
    this.logger.info(`[AuthCookieGuard] incoming request`, { method, url });
    this.logger.debug(`[AuthCookieGuard] cookie keys`, {
      cookieKeys: Object.keys(req.cookies || {}),
    });
    this.logger.debug(`[AuthCookieGuard] headers`, {
      headerKeys: Object.keys(req.headers || {}),
    });
    // 2) Extract cookie
    const jwtCookie = req.cookies?.jwt;
    this.logger.warn(`[AuthCookieGuard] jwt cookie present`, {
      present: Boolean(jwtCookie),
      value: this.redact(jwtCookie),
    });

    if (!jwtCookie) {
      this.logger.warn(`[AuthCookieGuard] no jwt cookie found`);
      throw new UnauthorizedException('No JWT cookie provided');
    }

    // 3) (Optional) Decode first to inspect payload shape/dates (no signature check)
    const decoded = this.jwtService.decode(jwtCookie) as JwtPayload | null;
    if (decoded) {
      this.logger.debug(`[AuthCookieGuard] decoded (UNVERIFIED)`, {
        sub: decoded.sub,
        email: decoded.email,
        iat: decoded.iat,
        exp: decoded.exp,
      });
    } else {
      this.logger.debug(`[AuthCookieGuard] decode returned null`);
    }

    // 4) Verify signature + claims
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(jwtCookie, {
        secret: this.jwtCfg.secret,
        audience: this.jwtCfg.audience,
        issuer: this.jwtCfg.issuer,
      });

      // 5) Attach user and continue
      req.user = payload;
      this.logger.info(`[AuthCookieGuard] jwt verified`, {
        sub: payload.sub,
        email: payload.email,
      });
      return true;
    } catch (err: any) {
      this.logger.error(
        `[AuthCookieGuard] jwt verification failed: ${err?.message || err}`,
        { name: err?.name, code: err?.code },
      );
      throw new UnauthorizedException('Invalid or expired JWT');
    }
  }
}
