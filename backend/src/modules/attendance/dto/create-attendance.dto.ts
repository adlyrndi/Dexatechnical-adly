import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({ example: '/uploads/12345.jpg', description: 'URL Foto Bukti Selfie dari endpoint /upload' })
  @IsNotEmpty()
  @IsString()
  clockInPhoto: string;

  @ApiPropertyOptional({ example: 'WFH dari rumah mertua', description: 'Catatan tambahan (Opsional)' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: -6.1234, description: 'Latitude lokasi Clock-In' })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 106.1234, description: 'Longitude lokasi Clock-In' })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
