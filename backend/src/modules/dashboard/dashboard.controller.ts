import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mendapatkan statistik ringkasan hari ini untuk Admin HRD' })
  getAdminStats() {
    return this.dashboardService.getAdminStats();
  }

  @Get('employee')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Mendapatkan statistik absen personal bulan ini' })
  getEmployeeStats(@Req() req: any) {
    return this.dashboardService.getEmployeeStats(req.user.userId);
  }
}
