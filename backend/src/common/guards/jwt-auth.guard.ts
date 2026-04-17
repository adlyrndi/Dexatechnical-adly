import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard ini akan mengeksekusi JwtStrategy kita untuk setiap endpoint yang dipasangkan padanya.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
