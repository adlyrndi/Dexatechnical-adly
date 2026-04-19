import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap karyawan' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @ApiProperty({ example: 'EMP-001', description: 'Nomor Identitas Pegawai (NIP)' })
  @IsNotEmpty({ message: 'NIP tidak boleh kosong' })
  nip: string;

  @ApiProperty({ example: 'budi@dexa.com', description: 'Email unik karyawan' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({ example: 'rahasia123', description: 'Minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({ enum: UserRole, required: false, default: UserRole.EMPLOYEE })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role harus valid (ADMIN atau EMPLOYEE)' })
  role?: UserRole;
}
