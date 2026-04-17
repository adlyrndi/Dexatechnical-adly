import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Attendances')
@ApiBearerAuth() // Memasangkan gembok JWT di Swagger Swagger UI
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Merekam absen masuk (Clock In)' })
  clockIn(@Req() req: any, @Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.clockIn(req.user.userId, createAttendanceDto);
  }

  @Post('clock-out')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Merekam absen selesai kerja (Clock Out)' })
  clockOut(@Req() req: any) {
    return this.attendanceService.clockOut(req.user.userId);
  }

  @Get('my-history')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Melihat riwayat absen diri sendiri' })
  getMyHistory(@Req() req: any) {
    return this.attendanceService.getMyAttendances(req.user.userId);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin HRD melihat seluruh histori log karyawan' })
  getAllLogs() {
    return this.attendanceService.getAllAttendances();
  }
}
