import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      // Menghasilkan nama unik
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // max 2MB
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Mengecek apakah extension image (png, jpg, jpeg, webp)
    if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(new BadRequestException(`Unsupported file type ${extname(file.originalname)}`), false);
    }
  },
};

@ApiTags('Uploads')
@Controller('upload')
export class UploadController {
  @Post()
  @ApiOperation({ summary: 'Upload foto bukti absen (Selfie)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Foto selfie (wajib jpeg, jpg, png, webp). Max 5MB.',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    // Return the path so frontend can save this path onto DB via clock-in API
    return {
      message: 'Upload Success',
      url: `/uploads/${file.filename}`,
    };
  }
}
