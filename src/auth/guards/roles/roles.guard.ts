import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../../constants/auth.constants';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: Role[] } }>();
    const user = request.user;
    return (
      !!user &&
      !!requiredRoles &&
      requiredRoles.some((role) => user.role?.includes(role))
    );
  }
}
