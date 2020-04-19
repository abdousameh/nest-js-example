import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { UploadExceptionFilter } from './filter/upload-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerService('Main'),
  });
  app.useStaticAssets(join(__dirname, '../../src/websockets', 'static'));
  app.useGlobalFilters(new UploadExceptionFilter());
  await app.listen(3000);
}
bootstrap();
