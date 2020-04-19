import { UploadError } from '../error/upload.error';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Definition of the database access
export const MONGODB_ROOT = process.env.MONGODB_ROOT;

// Definition of parameters for file uploading
export const UPLOAD_OPTIONS: MulterOptions = {
  dest: process.env.UPLOAD_DIR,
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
export const APP_ENV = process.env.APP_ENV;

// Minimum log level to ttrack in production logging files
export enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  ERROR,
}
export const PROD_LOG_LEVEL = LogLevel.INFO;

// Name of the application
export const APP_NAME = process.env.APP_NAME;

// Logging directory
export const LOG_DIR = process.env.LOG_DIR;

// Configuration for Nodemailer
export const MAILER_CONFIG = {
  host: process.env.MAILER_HOST,
  port: parseInt(process.env.MAILER_PORT),
  user: process.env.MAILER_USERNAME,
  password: process.env.MAILER_PASSWORD,
};

// Chat parameters
export const CHAT_PORT = parseInt(process.env.CHAT_PORT);
