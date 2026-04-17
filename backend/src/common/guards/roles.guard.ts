import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../modules/auth/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Jika tidak ada batasan roles, biarkan lewat
    if (!requiredRoles) {
      return true; 
    }

    // Ambil payload JWT yang sudah disuntik oleh Passport JwtStrategy ke dalam Request
    const { user } = context.switchToHttp().getRequest();
    
    // Validasi apakah role user yang sedang login cocok dengan salah satu role yang diperbolehkan
    return requiredRoles.some((role) => user.role === role);
  }
}
