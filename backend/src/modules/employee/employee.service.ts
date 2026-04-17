import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../auth/entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const existing = await this.userRepository.findOne({ where: { email: createEmployeeDto.email } });
    if (existing) throw new ConflictException('Email sudah terdaftar!');

    const hash = await bcrypt.hash(createEmployeeDto.password, 10);
    const user = this.userRepository.create({
      ...createEmployeeDto,
      passwordHash: hash,
    });
    
    await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async getAllEmployees() {
    return this.userRepository.find({
      where: { role: UserRole.EMPLOYEE },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' } // Karyawan terbaru di atas
    });
  }

  async getEmployeeById(id: string) {
    const employee = await this.userRepository.findOne({
      where: { id, role: UserRole.EMPLOYEE },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
    });

    if (!employee) throw new NotFoundException('Karyawan tidak ditemukan');
    return employee;
  }
}
