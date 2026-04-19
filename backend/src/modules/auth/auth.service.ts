import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existing) {
      throw new ConflictException('Email sudah terdaftar!');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      passwordHash: hashedPassword,
    });

    await this.userRepository.save(user);
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    
    const user = await this.userRepository.findOne({
      where: [
        { email: loginDto.email },
        { nip: loginDto.email } 
      ]
    });

    if (!user) {
      throw new UnauthorizedException('Email/NIP atau Password salah');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email/NIP atau Password salah');
    }
    

    if (user.isActive === false) {
      throw new UnauthorizedException('Akun ini telah dinonaktifkan.');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      message: "Sukses Login",
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'nip', 'name', 'email', 'role', 'department', 'position', 'phone', 'avatar', 'isActive', 'createdAt']
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan.');
    }

    return user;
  }
}
