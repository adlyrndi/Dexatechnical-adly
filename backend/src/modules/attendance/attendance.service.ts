import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  async clockIn(userId: string, dto: CreateAttendanceDto) {
    const todayStr = new Date().toISOString().split('T')[0];

    const existing = await this.attendanceRepo.findOne({
      where: { userId, date: todayStr }
    });

    if (existing && existing.clockInTime) {
      throw new BadRequestException('Anda sudah melalukan Clock-In hari ini!');
    }

    const attendance = this.attendanceRepo.create({
      userId,
      date: todayStr,
      clockInTime: new Date(),
      selfieUrl: dto.selfieUrl,
    });

    return this.attendanceRepo.save(attendance);
  }

  async clockOut(userId: string) {
    const todayStr = new Date().toISOString().split('T')[0];
    const attendance = await this.attendanceRepo.findOne({
      where: { userId, date: todayStr }
    });

    if (!attendance) {
      throw new NotFoundException('Anda harus Clock-In terlebih dahulu hari ini!');
    }
    if (attendance.clockOutTime) {
      throw new BadRequestException('Anda sudah Clock-Out hari ini!');
    }

    attendance.clockOutTime = new Date();
    return this.attendanceRepo.save(attendance);
  }

  async getMyAttendances(userId: string) {
    return this.attendanceRepo.find({
      where: { userId },
      order: { date: 'DESC' }
    });
  }

  async getAllAttendances() {
    return this.attendanceRepo.find({
      relations: ['user'],
      order: { date: 'DESC' }
    });
  }
}
