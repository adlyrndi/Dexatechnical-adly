import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './modules/auth/auth.service';
import { UserRole } from './modules/auth/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  console.log('🚀 Creating default admin account...');
  try {
    const adminData = {
      name: 'Super Admin',
      nip: 'ADMIN-001',
      email: 'admin@dexa.com',
      password: 'admin123',
      role: UserRole.ADMIN
    };
    
    await authService.register(adminData);
    console.log('✅ Admin created successfully!');
    console.log('Email: admin@dexa.com');
    console.log('Password: admin123');
  } catch (err) {
    if (err.status === 409) {
      console.log('⚠️ Admin account already exists or email is taken.');
    } else {
      console.error('❌ Failed to create admin:', err.message);
    }
  }
  
  await app.close();
}

bootstrap();
