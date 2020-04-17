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
import { MONGODB_ROOT } from './config/global.env';

@Module({
  imports: [
    TypegooseModule.forRoot(MONGODB_ROOT, {
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
