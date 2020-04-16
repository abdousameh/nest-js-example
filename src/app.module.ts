import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { UploadExceptionFilter } from './filter/upload-exception.filter';
import { UploadLoggerMiddleware } from './middleware/upload-logger.middleware';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost:27017/task-manager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    {
      provide: APP_FILTER,
      useClass: UploadExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadLoggerMiddleware)
      .forRoutes({ path: 'users/upload/*', method: RequestMethod.POST });
  }
}
