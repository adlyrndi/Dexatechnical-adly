import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({ example: '/uploads/12345.jpg' })
  @IsString()
  @IsNotEmpty({ message: 'Bukti selfie tidak boleh kosong' })
  selfieUrl: string;
}
