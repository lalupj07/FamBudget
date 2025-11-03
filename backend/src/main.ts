import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      // Don't abort on error - let app start even if DB connection fails initially
      abortOnError: false,
    });
    
    // Enable CORS for mobile app
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 FamBudget API running on http://0.0.0.0:${port}`);
    console.log(`✅ Health check available at /health`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

bootstrap();
