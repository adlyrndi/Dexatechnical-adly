import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../auth/entities/user.entity';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Budi Pekerja', description: 'Nama karyawan baru' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @ApiProperty({ example: 'budipekerja@dexa.com', description: 'Email khusus perusahaan' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password default untuk login' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.EMPLOYEE })
  @IsEnum(UserRole, { message: 'Role harus valid' })
  role: UserRole;
}
