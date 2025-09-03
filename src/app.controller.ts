import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { AuthType } from './auth/enums/auth-type.enum';
import { Auth } from './auth/decorators/auth.decorator';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { Role } from './auth/enums/role.enum';
import { Roles } from './auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Auth(AuthType.Cookie)
  @Roles(Role.User, Role.Admin)
  @UseGuards(RolesGuard)
  @Get()
  getHello(@CurrentUser() user: JwtPayload): string {
    this.logger.info('user' + user.email);
    return this.appService.getHello();
  }
}
