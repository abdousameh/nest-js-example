import { UploadError } from '../error/upload.error';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Definition of parameters for file uploading
export const UPLOAD_OPTIONS: MulterOptions = {
  dest: '/uploads',
  preservePath: false,
  limits: {
    fieldNameSize: 50,
    files: 1,
    fields: 5,
    fileSize: 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (
      (file.mimetype as string).toLowerCase().match(/image\/(jpg|jpeg|pgn)$/)
    ) {
      cb(null, true);
    } else {
      cb(
        new UploadError('Image uploaded is not of type jpg/jpeg or png'),
        false,
      );
    }
  },
};

// Environment of the application: 'dev' or 'prod'
export enum Environment {
  DEV = 'dev',
  PROD = 'prod',
}
export const APP_ENV = 'dev';

// Minimum log level to ttrack in production logging files
export enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  ERROR,
}
export const PROD_LOG_LEVEL = LogLevel.INFO;

// Name of the application
export const APP_NAME = 'app';

// Logging directory
export const LOG_DIR = '/logs';
