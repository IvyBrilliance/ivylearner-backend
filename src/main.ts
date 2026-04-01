import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';

console.log('Current NODE_ENV:', process.env.NODE_ENV);
console.log('Database URL exists?:', !!process.env.DATABASE_URL); // Replace with one of your vars

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS configuration
app.enableCors({
  origin: ['http://localhost:8081',
    'http://192.168.0.33:8081',
    'https://ivybrilliance.com',
    'https://www.ivybrilliance.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

    // Global prefix
    app.setGlobalPrefix('backend');

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('IvyLearner LMS API')
        .setDescription('Learning Management System API Documentation')
        .setVersion('2.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('Auth', 'Authentication endpoints')
        .addTag('Users', 'User management endpoints')
        .addTag('Organizations', 'Organization management endpoints')
        .addTag('Courses', 'Course management endpoints')
        .addTag('Enrollments', 'Enrollment management endpoints')
        .addTag('Lessons', 'Lesson management endpoints')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });

    const port = process.env.PORT ?? 5000;
    await app.listen(port);
    
    console.log(`🚀 Server running on port: ${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();