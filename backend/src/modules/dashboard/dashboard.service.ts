import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from '../auth/entities/user.entity';
import { Attendance, AttendanceStatus } from '../attendance/entities/attendance.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  async getAdminStats() {
    const todayStr = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().split('T')[0];
    
    const totalEmployees = await this.userRepo.count({ where: { role: UserRole.EMPLOYEE, isActive: true } });
    const totalPresentToday = await this.attendanceRepo.count({ where: { attendanceDate: todayStr, status: AttendanceStatus.PRESENT } });
    const totalLateToday = await this.attendanceRepo.count({ where: { attendanceDate: todayStr, status: AttendanceStatus.LATE } });
    

    const totalAbsentToday = totalEmployees - (totalPresentToday + totalLateToday);

    return {
      totalEmployees,
      today: {
        present: totalPresentToday,
        late: totalLateToday,
        absent: totalAbsentToday > 0 ? totalAbsentToday : 0, 
      }
    };
  }

  async getEmployeeStats(userId: string) {
    const todayStr = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().split('T')[0];
    const currentYearMonth = todayStr.substring(0, 7);

    const totalPresentMonth = await this.attendanceRepo.count({ 
      where: { userId, attendanceDate: Like(`${currentYearMonth}%`), status: AttendanceStatus.PRESENT }
    });

    const totalLateMonth = await this.attendanceRepo.count({ 
      where: { userId, attendanceDate: Like(`${currentYearMonth}%`), status: AttendanceStatus.LATE }
    });

    const isClockedInToday = await this.attendanceRepo.findOne({
      where: { userId, attendanceDate: todayStr }
    });

    return {
      monthly: {
        present: totalPresentMonth,
        late: totalLateMonth,
      },
      todayStatus: isClockedInToday ? isClockedInToday.status : 'NOT_CLOCKED_IN',
      clockInTime: isClockedInToday?.clockInTime || null,
      clockOutTime: isClockedInToday?.clockOutTime || null,
    };
  }
}
