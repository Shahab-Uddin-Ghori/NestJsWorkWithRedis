// Path: src\main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Trading App API')
    .setDescription('API documentation for Trading Application')
    .setVersion('1.0')
    .addTag('trading')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  console.log('Application is running on: http://localhost:7000');
  console.log('Swagger UI is available at: http://localhost:7000/api-docs');

  await app.listen(process.env.PORT ?? 7000);
}
bootstrap();
