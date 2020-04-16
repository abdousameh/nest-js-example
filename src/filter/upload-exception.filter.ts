import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { UploadError } from '../error/upload.error';

@Catch(UploadError)
export class UploadExceptionFilter implements ExceptionFilter<UploadError> {
  catch(exception: UploadError, host: ArgumentsHost) {
    if (exception.name === UploadError.name) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = 403;

      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
    } else {
      return exception;
    }
  }
}
