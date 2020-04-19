import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { AlertGateway } from './alert.gateway';
import { LoggerService } from '../../logger/logger.service';

@Controller('alert')
export class AlertController {
  private readonly logger = new LoggerService(AlertController.name);

  constructor(private alertGateway: AlertGateway) {}

  @Post()
  @HttpCode(200)
  sendAlertToAll(@Body() dto: { message: string }) {
    this.logger.setMethod(this.sendAlertToAll.name);
    this.logger.debug(`Alert message: ${dto.message}`);
    this.alertGateway.sendToAll(dto.message);
  }
}
