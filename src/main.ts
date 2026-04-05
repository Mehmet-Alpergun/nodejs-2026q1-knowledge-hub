import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { wireCascades } from './app.bootstrap';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Knowledge Hub API')
    .setDescription('REST API for the Knowledge Hub platform')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('doc', app, SwaggerModule.createDocument(app, config));

  // Wire cascade delete dependencies between services AFTER app is initialized
  wireCascades(app);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  logger.log(`Running on http://localhost:${port}`);
  logger.log(`Swagger: http://localhost:${port}/doc`);
}
bootstrap();
