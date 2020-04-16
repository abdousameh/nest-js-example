import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { UploadExceptionFilter } from './filter/upload-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Main'),
  });
  app.useGlobalFilters(new UploadExceptionFilter());
  await app.listen(3000);
}
bootstrap();
