import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { UploadExceptionFilter } from './filter/upload-exception.filter';
import { APP_LISTEN_PORT } from './config/global.env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Main'),
  });
  app.useGlobalFilters(new UploadExceptionFilter());
  await app.listen(APP_LISTEN_PORT);
}
bootstrap();
