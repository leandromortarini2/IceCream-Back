import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/Users/users.entity';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
