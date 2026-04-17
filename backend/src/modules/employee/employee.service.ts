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
    const { passwordHash, ...result } = user;
    return result;
  }

  async getAllEmployees() {
    return this.userRepository.find({
      where: { role: UserRole.EMPLOYEE },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' }
    });
  }

  async getEmployeeById(id: string) {
    const employee = await this.userRepository.findOne({
      where: { id, role: UserRole.EMPLOYEE },
      select: ['id', 'email', 'name', 'role', 'department', 'position', 'phone', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!employee) throw new NotFoundException('Karyawan tidak ditemukan');
    return employee;
  }

  async updateEmployee(id: string, updateEmployeeDto: any) {
    const employee = await this.userRepository.findOne({ where: { id, role: UserRole.EMPLOYEE } });
    if (!employee) throw new NotFoundException('Karyawan tidak ditemukan');

    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const conflict = await this.userRepository.findOne({ where: { email: updateEmployeeDto.email } });
      if (conflict) throw new ConflictException('Email sudah terdaftar di akun lain!');
    }

    Object.assign(employee, updateEmployeeDto);
    await this.userRepository.save(employee);
    
    const { passwordHash, ...result } = employee;
    return result;
  }

  async softDeleteEmployee(id: string) {
    const employee = await this.userRepository.findOne({ where: { id, role: UserRole.EMPLOYEE } });
    if (!employee) throw new NotFoundException('Karyawan tidak ditemukan');

    employee.isActive = false;
    await this.userRepository.save(employee);
    return { message: 'Karyawan berhasil dinonaktifkan (Soft Delete)' };
  }
}

