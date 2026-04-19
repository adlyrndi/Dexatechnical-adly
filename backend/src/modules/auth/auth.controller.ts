import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from './entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login dan Dapatkan JWT Token' })
  @ApiResponse({ status: 200, description: 'Berhasil login' })
  @ApiResponse({ status: 401, description: 'Kredensial salah' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrasi mandiri karyawan baru' })
  @ApiResponse({ status: 201, description: 'Berhasil registrasi' })
  @ApiResponse({ status: 409, description: 'Email sudah dipakai' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('seed-admin')
  @ApiOperation({ summary: 'Endpoint rahasia untuk membuat akun admin pertama via Browser (Hapus setelah dipakai!)' })
  async seedAdmin() {
    console.log('--- SEEDING ADMIN ACCOUNT ---');
    try {
      
      const repo = (this.authService as any).userRepository; 
      let user = await repo.findOne({ where: { email: 'admin@dexa.com' } });
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      if (user) {
        user.passwordHash = hashedPassword;
        user.role = UserRole.ADMIN;
        await repo.save(user);
        return { message: "Admin Account Ready (Password Reset to admin123)" };
      }

      const result = await this.authService.register({
        name: 'Super Admin',
        nip: 'ADMIN-001',
        email: 'admin@dexa.com',
        password: 'admin123',
        role: UserRole.ADMIN
      });
      return { message: "Admin Created Successfully!", email: 'admin@dexa.com', password: 'admin123' };
    } catch (e) {
      return { message: "Error seeding admin", error: e.message };
    }
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Melihat profil sendiri' })
  getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout (Client membuang JWT Token)' })
  logout() {
    return { message: 'Berhasil logout. Silakan hapus token di localStorage klien.' };
  }
}

