import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const startTime = Date.now();
  
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Starting FamBudget API...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Port: ${process.env.PORT || 3000}`);
    console.log(`🕐 Start time: ${new Date().toISOString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check critical environment variables
    const criticalVars = {
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ? '✅' : '❌',
      JWT_SECRET: process.env.JWT_SECRET ? '✅' : '❌',
      DB_HOST: process.env.DB_HOST ? '✅' : '❌',
      NODE_ENV: process.env.NODE_ENV ? '✅' : '❌',
      PORT: process.env.PORT ? '✅' : '⚠️',
    };
    
    console.log('📋 Environment Variables Check:');
    Object.entries(criticalVars).forEach(([key, status]) => {
      console.log(`   ${status} ${key}`);
    });
    
    // Create app with options to prevent startup failures
    try {
      console.log('📦 Creating NestJS application...');
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

      const port = parseInt(process.env.PORT || '3000');
      
      // Start listening
      console.log(`🌐 Starting HTTP server on port ${port}...`);
      await app.listen(port, '0.0.0.0');
      
      const startupTime = ((Date.now() - startTime) / 1000).toFixed(2);
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✅ SERVER IS LISTENING!`);
      console.log(`   URL: http://0.0.0.0:${port}`);
      console.log(`   Health: http://0.0.0.0:${port}/health`);
      console.log(`   Startup time: ${startupTime}s`);
      console.log(`🚀 FamBudget API is READY!`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Log environment check summary
      const requiredEnvVars = ['ENCRYPTION_KEY', 'JWT_SECRET', 'DB_HOST', 'NODE_ENV'];
      const missingVars = requiredEnvVars.filter(v => !process.env[v]);
      if (missingVars.length > 0) {
        console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
        console.warn(`   App will start but some features may not work`);
      } else {
        console.log('✅ All required environment variables are set');
      }
    } catch (moduleError) {
      console.error('❌ Failed to create NestJS app:', moduleError.message);
      console.error('This might be due to missing environment variables or database connection');
      throw moduleError;
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
