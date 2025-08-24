import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Observable, map } from 'rxjs';

@Injectable()
export class DataResponseInterceptor<T = unknown>
  implements
    NestInterceptor<unknown, { apiVersion: string | undefined; data: T }>
{
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ apiVersion: string | undefined; data: T }> {
    return next.handle().pipe(
      map((data: T) => ({
        apiVersion: this.configService.get<string>('appConfig.apiVersion'),
        data,
      })),
    );
  }
}
