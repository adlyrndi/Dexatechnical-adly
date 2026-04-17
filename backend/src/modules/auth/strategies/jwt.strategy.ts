import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Token akan diekstrak dari header HTTP Authorization: Bearer <TOKEN>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Tolak token yang sudah kadaluarsa
      secretOrKey: configService.get<string>('JWT_SECRET', 'rahasia123'),
    });
  }

  // Passport otomatis mengeksekusi ini jika token valid
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
