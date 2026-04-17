import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(helmet());

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out unexpected properties
      transform: true, // auto transform payloads to DTO instances
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('WFH Attendance API')
    .setDescription('The WFH Attendance System and Monitoring API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Accessible at http://localhost:3001/api/docs

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
