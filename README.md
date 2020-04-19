<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>

## Description

<!-- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. -->

This project has developed to give some examples of some functionalities of NestJS framework. I am learning this framework alone and I'm having a lot of trouble with some functionalities. If you are beginner like me, I hope that this project will help you a little.
If you have some remarks, on my english whichi s not very good, on my programming style to improve it, on some bugs you have found to solve its, on some improvement on my code to improve it, on some new functionalities to add its if possible (it could be easier for me if you some code to propose to me).

## Version

This project has been developed with 7.0.0 of NodeJS.

## Installation

```bash
$ git clone https://github.com/afontange/nest-js-example.git
$ cd project
$ npm install
$ npm run start
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# 1 - Configuration

Library used :

- env-cmd

Before to start the project, you must create <em>.env</em> file under main directory. This file must contain the following configuration :

```bash
APP_LISTEN_PORT=3000
MONGODB_ROOT=mongodb://localhost:27017/##<database-name>##
UPLOAD_DIR=/uploads
APP_NAME=app
APP_ENV=dev
LOG_DIR=/logs
MAILER_HOST=##<mailer-host>##
MAILER_PORT=##<mailer-port>##
MAILER_USERNAME=##<connection-username>##
MAILER_PASSWORD=##<connection-password>##
MAILER_FROM=##<from-adress>##
MAILER_RECIPIENT=##<test-recipient-address>##
CHAT_PORT=3001
```

# 2 - Logger

Libraries used :

- winston
- winston-daily-rotate
- pretty-error
- chalk

I have created a rolling logger. This logger has been created using some code found on web but I adapted it to my needs.

This logger has 2 functioning modes:

- In development: The logs are displayed at screen. Each log level is displayed with a color

  - White for debug level
  - <span style="color: #00BFFF">Blue for info level</span>
  - <span style="color: yellow">Yellow for warning level</span>
  - <span style="color: red">Red for error level</span>

- In production: The logs are stored in daily files :
  - The log files directory is define by parameter <em>LOG_DIR</em>
  - The log file name is as follows : "yyyyMMdd*<em>APP_NAME</em>*<em>APP_ENV</em>.log" where :
    - yyyyMMdd is the date,
    - <em>APP_NAME</em> is the name of your application
    - <em>APP_ENV</em> is the running environment (equals to "prod")
  - The log messages are stored on json format

For using this logger you must :

- Add the following code in the file "main.ts:

```bash
import { LoggerService } from './logger/logger.service';
...

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Main'),
  });
  ...
  await app.listen(3000);
}
bootstrap();
```

- For each class where you want to use this logger, you have to :

```bash
import { LoggerService } from './logger/logger.service';
...

export class UsersController {
  private readonly logger = new LoggerService(UsersController.name);
  ...

  async getUser(@Param('username') username: string) {
    this.logger.setMethod(this.getUser.name);
    ...
  }
  ...
}
```

- Import the <em>LoggerService</em>
- Create the new <em>logger</em> at the beginning of the class
- For each method you must call the <em>setMethod()</em> for having the name of the method in the log
- To send a message to the log, you must call the logger as follows :
  - For debug level :
    ```bash
    this.logger.debug(`Message debug to send ...`);
    ```
  - For info level :
    ```bash
    this.logger.info(`Message info to send ...`);
    or :
    this.logger.log(`Message info to send ...`);
    ```
  - For warning level :
    ```bash
    this.logger.warning(`Message warning to send ...`);
    ```
  - For error level :
    ```bash
    this.logger.error(`Message error to send ...`, error);
    ```

The parameters of logger are define in file <em>global.env.ts</em>.

# 3 - MongoDB connexion

Librairies used:

- mongodb
- mongoose
- bcrypt
- class-validator

For MongoDB, I have created a local database and developped a <em>users</em> module in which I created some CRUD methods as examples.

# 4 - File upload

Library used:

- multer

To develop the file upload, I had many troubles. It seems that the multer configuration definition in the <em>AppModule</em> does not work. <span style="color: red">Don't declare <em>UPLOAD_OPTIONS</em> in tha <em>AppModule</em> as follows</span> :

```bash
import { MulterModule } from '@nestjs/platform-express';
...
@Module({
  imports: [
    MulterModule.register(UPLOAD_OPTIONS),
  ],
})
export class AppModule {}
```

You must user the Multer configuration locally. I have developed the <em>uploadAvatarFile</em> method in <em>UsersController</em> es example.

```bash
  @Post('upload/:username')
  @UseInterceptors(FileInterceptor('avatar', UPLOAD_OPTIONS))
  uploadAvatarFile(@Param('username') username: string, @UploadedFile() file) {
  ...
  }
```

The <em>UPLOAD_OPTIONS</em> are definde in the <em>global.env.ts</em> file. In the example, there is a filter file example. Only jpg, jpeg and png files are accepted. The other files are rejected.

# 5 - Exception filter

I have tried to implement an exception filter, and I had also many troubles to do this.
My exception filter is implemented in the class <em>UploadExceptionFilter</em>.

To integrate an exception filter, you have to :

- Modify the <em>main.ts</em> file as follows :

```bash
import { UploadExceptionFilter } from './filter/upload-exception.filter';

async function bootstrap() {
  app.useGlobalFilters(new UploadExceptionFilter());
  ...
  await app.listen(3000);
}
bootstrap();
```

- Modify the <em>app.module.ts</em> file as follows :

```bash
import { APP_FILTER } from '@nestjs/core';
import { UploadExceptionFilter } from './filter/upload-exception.filter';

@Module({
  imports: [
    {
      provide: APP_FILTER,
      useClass: UploadExceptionFilter,
    },
  ],
})
export class AppModule {}
```

- Call the exception filter as follows :

```bash
import { UploadExceptionFilter } from 'src/filter/upload-exception.filter';

@Controller('users')
export class UsersController {
  ...

  @Post('upload/:username')
  @UseFilters(new UploadExceptionFilter())
  async uploadAvatarFile(
    @Param('username') username: string,
    @UploadedFile() file,
  ) {
  ...
  }
```

This exception filter is installed but it is not working. When I upload a file no problem. When there another error like user yet exist when you try to create one, it does not work because exception filter intercept all exceptions. On exception filter there is <span style="color: #00BFFF"><em>@Catch()</em></span> without any filter. When modify the catch as <span style="color: #00BFFF"><em>@Catch(UploadError)</em></span>, it is working for user creation but not for avatar file uploading. <span style="color: red">For me, it seems to be a bug. Don't use this exception filter as it. A bug correction has to done or somebody has to explain to me how to do.</span>

# 6 - Middleware

I have created a middleware named <span style="color: #00BFFF"><em>UploadLoggerMiddleware</em></span>. For using this middleware, you have to :

- Modify the <em>AppModule</em> as follows :

```bash
import { UploadLoggerMiddleware } from './middleware/upload-logger.middleware';

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadLoggerMiddleware)
      .forRoutes({ path: 'users/upload/*', method: RequestMethod.POST });
  }
}
```

This middleware will be apply to all the routes "users/upload/\*".

- Normally you nothing to do more. But in my case, before testing this middleware, I had to modify the filter <span style="color: #00BFFF"><em>UploadExceptionFilter</em></span> for replacing <span style="color: #00BFFF"><em>@Catch(UploadError)</em></span> by <span style="color: #00BFFF"><em>@Catch()</em></span>.

# 7 - Mailer

Library used :

- nodemailer

I have deveoped a simple class named <em>MailService</em>. The mailer configuration is define in <em>global.env.ts</em>. Before using this class you need to upgrade the configuration with your own data. You need alse to modify the class <em>MailService</em> for upgrading your own email address.

# 8 - Tests

All the tests have been made with Postman. You can find test collection used in <span style="color: #00BFFF"><em>"Postman/nest-js-example.postman_collection.json"</em></span>.

An example of end-to-end test has been added to this project. This example is stored in <em>tests-e2e</em> directory. This example shows how to write end-to-end tests in separated files. Before to execute this test suite, you need to create <em>.env.test</em> file in main directory. This file contains the configuration for tests. You can, for example use a specific database.

The content of the configuration file is identical to the <em>.env</em> file described in chapter 1.

# 8 - Websockets

In this project, I have integrated an example of websockets. This example has been greatly inspired from the following video course of Brian Johnson :

https://www.youtube.com/watch?v=0zyYhm5MjJ4

I have just made some modifications and improvements.

The module <em>main.ts</em>, to be able to deliver static files, has been modified as follows :
```bash
import { join } from 'path';

async function bootstrap() {
  ...
  app.useStaticAssets(join(__dirname, '../../src/websockets', 'static'));
  await app.listen(3000);
}
bootstrap();
```

The module <em>app.module.ts</em> has been modified has follows :
```bash
import { ChatGateway } from './websockets/chat/chat.gateway';
import { AlertGateway } from './websockets/alert/alert.gateway';
import { AlertController } from './websockets/alert/alert.controller';

@Module({
  ...
  controllers: [AlertController],
  providers: [
    ...
    ChatGateway,
    AlertGateway,
  ],
})
export class AppModule implements NestModule {
  ...
}
```
The client has been developed using Vue.js.

The URL to connect to the client is the following : http://localhost:3000

The source code for the client and the server is under <em>websockets</em> directory.

This example implements a chat with 3 rooms (General, TypeScript, NestJs) and an alert broadcasting.

For the alert broadcasting, you need to use Postman with the request <em>Websocket broadcasting</em>.

## About

- Author - [afontange] Email: <afon1631@aol.com>

## License

Nest is [MIT licensed](LICENSE).
