import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin menambah karyawan baru (Khusus Admin)' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Melihat daftar semua karyawan (Khusus Admin)' })
  findAll() {
    return this.employeeService.getAllEmployees();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Detail profil 1 karyawan' })
  findOne(@Param('id') id: string) {
    return this.employeeService.getEmployeeById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update data karyawan (Admin)' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: import('./dto/update-employee.dto').UpdateEmployeeDto) {
    return this.employeeService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Soft delete karyawan (Admin)' })
  remove(@Param('id') id: string) {
    return this.employeeService.softDeleteEmployee(id);
  }
}

