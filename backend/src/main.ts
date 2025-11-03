import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting FamBudget API...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Port: ${process.env.PORT || 3000}`);
    
    // Create app with options to prevent startup failures
    const app = await NestFactory.create(AppModule, {
      // Don't abort on error - let app start even if DB connection fails initially
      abortOnError: false,
      // Don't fail if logger can't initialize
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    console.log('✅ NestJS application created');
    
    // Enable CORS for mobile app
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    console.log('✅ CORS enabled');

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    console.log('✅ Validation pipe configured');

    const port = process.env.PORT || 3000;
    
    // Start listening
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Server listening on http://0.0.0.0:${port}`);
    console.log(`✅ Health check available at http://0.0.0.0:${port}/health`);
    console.log(`🚀 FamBudget API is READY!`);
    
    // Log environment check
    const requiredEnvVars = ['ENCRYPTION_KEY', 'JWT_SECRET', 'DB_HOST', 'NODE_ENV'];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
      console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    } else {
      console.log('✅ All required environment variables are set');
    }
  } catch (error) {
    console.error('❌ Failed to start application:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    // Don't exit immediately - give Railway time to see the error
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  }
}

bootstrap();
