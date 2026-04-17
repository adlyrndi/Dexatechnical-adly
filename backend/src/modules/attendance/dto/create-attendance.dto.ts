import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({ example: '/uploads/12345.jpg', description: 'URL Foto Bukti Selfie (Sementara pakai URL dummy jika Upload Moudle belum siap)' })
  @IsString()
  @IsNotEmpty({ message: 'Bukti selfie tidak boleh kosong' })
  selfieUrl: string;

  @ApiProperty({ example: -6.1751, description: 'Latitude lokasi absen' })
  @IsNumber()
  @IsNotEmpty({ message: 'Latitude wajib diisi' })
  latitude: number;

  @ApiProperty({ example: 106.8272, description: 'Longitude lokasi absen' })
  @IsNumber()
  @IsNotEmpty({ message: 'Longitude wajib diisi' })
  longitude: number;
}
