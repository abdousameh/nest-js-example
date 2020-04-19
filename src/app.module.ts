import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { UploadExceptionFilter } from './filter/upload-exception.filter';
import { UploadLoggerMiddleware } from './middleware/upload-logger.middleware';
import { UsersService } from './users/users.service';
import { MONGODB_ROOT } from './config/global.env';
import { ChatGateway } from './websockets/chat/chat.gateway';
import { AlertGateway } from './websockets/alert/alert.gateway';
import { AlertController } from './websockets/alert/alert.controller';

@Module({
  imports: [
    TypegooseModule.forRoot(MONGODB_ROOT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    UserModule,
  ],
  controllers: [AlertController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: UploadExceptionFilter,
    },
    ChatGateway,
    AlertGateway,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadLoggerMiddleware)
      .forRoutes({ path: 'users/upload/*', method: RequestMethod.POST });
  }
}
