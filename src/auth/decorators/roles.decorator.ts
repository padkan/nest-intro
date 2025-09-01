import { Role } from '../enums/role.enum';
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/auth.constants';

export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLES_KEY, roles);
