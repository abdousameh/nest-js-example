import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UploadLoggerMiddleware implements NestMiddleware {
  private readonly logger = new LoggerService(UploadLoggerMiddleware.name);
  use(req: Request, res: Response, next: Function) {
    this.logger.setMethod(this.use.name);
    // Middleware code to implement
    this.logger.log('UploadLoggerMiddleware ...');
    next();
  }
}
