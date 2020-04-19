import * as winston from 'winston';
import { LoggerOptions, Logger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as chalk from 'chalk';
import * as PrettyError from 'pretty-error';
import {
  APP_ENV,
  APP_NAME,
  LOG_DIR,
  PROD_LOG_LEVEL,
  LogLevel,
  Environment,
} from '../config/global.env';

export class LoggerService {
  private readonly logger: Logger;
  private methodName: string;
  private readonly prettyError = new PrettyError();

  public static loggerOptions: LoggerOptions = {
    format: winston.format.json(),
    transports: [
      new DailyRotateFile({
        filename: `${LOG_DIR}/%DATE%_${APP_NAME}_${APP_ENV}.log`,
        datePattern: 'YYYYMMDD',
      }),
    ],
  };

  constructor(private className: string) {
    if (!this.logger) {
      this.logger = (winston as any).createLogger(LoggerService.loggerOptions);
      this.prettyError.skipNodeFiles();
      this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
    }
  }

  setMethod(method = '') {
    this.methodName = method;
  }

  debug(message: string): void {
    if (
      APP_ENV === Environment.PROD.toString() &&
      PROD_LOG_LEVEL <= LogLevel.DEBUG
    ) {
      const currentDate = new Date();
      this.logger.debug(message, {
        timestamp: currentDate.toISOString(),
        context:
          this.className + (this.methodName ? `.${this.methodName}` : ''),
      });
    }
    this.formatedLog(LogLevel.DEBUG, message);
  }

  info(message: string): void {
    if (
      APP_ENV === Environment.PROD.toString() &&
      PROD_LOG_LEVEL <= LogLevel.INFO
    ) {
      const currentDate = new Date();
      this.logger.info(message, {
        timestamp: currentDate.toISOString(),
        context:
          this.className + (this.methodName ? `.${this.methodName}` : ''),
      });
    }
    this.formatedLog(LogLevel.INFO, message);
  }

  log(message: string): void {
    if (
      APP_ENV === Environment.PROD.toString() &&
      PROD_LOG_LEVEL <= LogLevel.INFO
    ) {
      const currentDate = new Date();
      this.logger.info(message, {
        timestamp: currentDate.toISOString(),
        context:
          this.className + (this.methodName ? `.${this.methodName}` : ''),
      });
    }
    this.formatedLog(LogLevel.INFO, message);
  }

  warn(message: string): void {
    if (
      APP_ENV === Environment.PROD.toString() &&
      PROD_LOG_LEVEL <= LogLevel.WARNING
    ) {
      const currentDate = new Date();
      this.logger.warn(message, {
        timestamp: currentDate.toISOString(),
        context:
          this.className + (this.methodName ? `.${this.methodName}` : ''),
      });
    }
    this.formatedLog(LogLevel.WARNING, message);
  }

  error(message: string, trace?: any): void {
    if (
      APP_ENV === Environment.PROD.toString() &&
      PROD_LOG_LEVEL <= LogLevel.ERROR
    ) {
      const currentDate = new Date();
      // i think the trace should be JSON Stringified
      this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
        timestamp: currentDate.toISOString(),
        context:
          this.className + (this.methodName ? `.${this.methodName}` : ''),
      });
    }
    this.formatedLog(LogLevel.ERROR, message, trace);
  }

  static formatDate(Date: Date): string {
    const dateFormatted: string =
      ('0' + Date.getUTCDate()).slice(-2) +
      '/' +
      ('0' + (Date.getUTCMonth() + 1)).slice(-2) +
      '/' +
      Date.getUTCFullYear() +
      ' ' +
      ('0' + Date.getUTCHours()).slice(-2) +
      ':' +
      ('0' + Date.getUTCMinutes()).slice(-2) +
      ':' +
      ('0' + Date.getUTCSeconds()).slice(-2) +
      '.' +
      ('00' + Date.getUTCMilliseconds()).slice(-3);
    return dateFormatted;
  }

  // this method just for printing a cool log in your terminal , using chalk
  private formatedLog(level: LogLevel, message: string, error?): void {
    let result = '';
    const color = chalk.default;
    const currentDate = new Date();

    if (APP_ENV === Environment.DEV.toString()) {
      switch (level) {
        case LogLevel.DEBUG:
          result = `[${color.white('DEBG')}] ${color.dim.white.bold.underline(
            LoggerService.formatDate(currentDate),
          )} [${color.white(
            this.className + (this.methodName ? `.${this.methodName}` : ''),
          )}] ${color.white(message)}`;
          break;
        case LogLevel.INFO:
          result = `[${color.blue('INFO')}] ${color.dim.blue.bold.underline(
            LoggerService.formatDate(currentDate),
          )} [${color.blue(
            this.className + (this.methodName ? `.${this.methodName}` : ''),
          )}] ${color.blue(message)}`;
          break;
        case LogLevel.WARNING:
          result = `[${color.yellow('WARN')}] ${color.dim.yellow.bold.underline(
            LoggerService.formatDate(currentDate),
          )} [${color.yellow(
            this.className + (this.methodName ? `.${this.methodName}` : ''),
          )}] ${color.yellow(message)}`;
          break;
        case LogLevel.ERROR:
          result = `[${color.red('ERR.')}] ${color.dim.red.bold.underline(
            LoggerService.formatDate(currentDate),
          )} [${color.red(
            this.className + (this.methodName ? `.${this.methodName}` : ''),
          )}] ${color.red(message)}`;
          if (error) {
            this.prettyError.render(error, true);
          }
          break;
        default:
          break;
      }
      console.log(result);
    }
  }
}
