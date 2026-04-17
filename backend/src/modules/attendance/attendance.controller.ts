import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Attendances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Absen masuk beserta kirim Latitude/Longitude dan URL Selfie' })
  clockIn(@Req() req: any, @Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.clockIn(req.user.userId, createAttendanceDto);
  }

  @Post('clock-out')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Absen pulang' })
  clockOut(@Req() req: any) {
    return this.attendanceService.clockOut(req.user.userId);
  }

  @Get('today')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Cari apakah hari ini user sedah clock-in atau belum' })
  getTodayStatus(@Req() req: any) {
    return this.attendanceService.getTodayStatus(req.user.userId);
  }

  @Get('history')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Daftar riwayat absen (Personal)' })
  findMyHistory(@Req() req: any) {
    return this.attendanceService.getMyAttendances(req.user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Monitoring rekap semua data absen (Khusus Admin)' })
  findAll() {
    return this.attendanceService.getAllAttendances();
  }
}
