import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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
  @ApiOperation({ summary: 'Daftar akun baru (Pekerja / Admin)' })
  @ApiResponse({ status: 201, description: 'Berhasil registrasi' })
  @ApiResponse({ status: 409, description: 'Email sudah dipakai' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
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

