import { SetMetadata } from '@nestjs/common';
import { Role } from '../modules/Users/entity/users.entity';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
