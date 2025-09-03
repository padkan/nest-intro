import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Logger } from 'winston';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(@Inject('winston') private readonly logger: Logger) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => JwtCookieStrategy.extractJWT.call(undefined, req), // custom extractor with explicit binding
        ExtractJwt.fromAuthHeaderAsBearerToken(), // fallback: Authorization: Bearer ...
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default_secret',
    });
    this.logger.info('Initializing JWT cookie strategy');
  }

  // 👇 our custom extractor function
  private static extractJWT(req: Request): string | null {
    if (req.cookies && typeof req.cookies['jwt'] === 'string') {
      return req.cookies['jwt']; // 👈 must match cookie name you set in login
    }
    return null;
  }

  validate(payload: { sub: string; email: string; roles?: string[] }) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    // Attach to req.user
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles ?? [],
    };
  }
}
