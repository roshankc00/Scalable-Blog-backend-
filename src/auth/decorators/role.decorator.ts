import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/users/constants/enums/role.enum';

export const RolesDec = (...roles: Roles[]) => SetMetadata('roles', roles);
