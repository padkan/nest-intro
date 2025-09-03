import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import type { Request } from 'express';
import { REQUEST_USER_KEY } from '../../constants/auth.constants';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Logger } from 'winston';

@Injectable()
export class AccessTokenGuard implements CanActivate {
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
    @Inject('winston') private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.info('Access token guard activated');
    // Extract the request from execution context
    const request = context.switchToHttp().getRequest<Request>();
    if (!request) {
      throw new UnauthorizedException('Request is missing');
    }
    // extract token from the header
    const token = this.extractRequestFromHeader(request);
    // validate token
    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
      //console.log('User payload:', payload);
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
