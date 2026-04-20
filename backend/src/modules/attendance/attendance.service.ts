import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  async clockIn(userId: string, dto: CreateAttendanceDto) {
    const now = new Date();
    const todayStr = new Date(now.getTime() + (7 * 60 * 60 * 1000)).toISOString().split('T')[0];

    const existing = await this.attendanceRepo.findOne({
      where: { userId, attendanceDate: todayStr }
    });

    if (existing && existing.clockInTime) {
      throw new BadRequestException('Anda sudah melakukan Clock-In hari ini!');
    }


    const localNow = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const currentHour = localNow.getUTCHours();
    const currentMinute = localNow.getUTCMinutes();
    

    const isLate = currentHour > 8 || (currentHour === 8 && currentMinute > 0);
    const status = isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

    const attendance = this.attendanceRepo.create({
      userId,
      attendanceDate: todayStr,
      clockInTime: now,
      clockInPhoto: dto.clockInPhoto,
      status,
      notes: dto.notes,
    });

    return this.attendanceRepo.save(attendance);
  }

  async clockOut(userId: string, clockOutPhoto?: string) {
    const now = new Date();
    const todayStr = new Date(now.getTime() + (7 * 60 * 60 * 1000)).toISOString().split('T')[0];
    const attendance = await this.attendanceRepo.findOne({
      where: { userId, attendanceDate: todayStr }
    });

    if (!attendance) throw new NotFoundException('Anda belum Clock-In hari ini!');
    if (attendance.clockOutTime) throw new BadRequestException('Anda sudah Clock-Out hari ini!');

    attendance.clockOutTime = new Date();
    if (clockOutPhoto) {
      attendance.clockOutPhoto = clockOutPhoto;
    }
    
    return this.attendanceRepo.save(attendance);
  }

  async getTodayStatus(userId: string) {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.attendanceRepo.findOne({
      where: { userId, attendanceDate: todayStr }
    });
  }

  async getMyAttendances(userId: string) {
    return this.attendanceRepo.find({
      where: { userId },
      order: { attendanceDate: 'DESC' }
    });
  }

  async getAllAttendances() {
    return this.attendanceRepo.find({
      relations: ['user'],
      order: { attendanceDate: 'DESC' }
    });
  }
}
