import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LoggerService } from '../../logger/logger.service';
import { CHAT_PORT } from '../../config/global.env';

@WebSocketGateway(CHAT_PORT, { namespace: '/alert' })
export class AlertGateway {
  private readonly logger = new LoggerService(AlertGateway.name);

  @WebSocketServer() wss: Server;

  sendToAll(msg: string) {
    this.wss.emit('alertToClient', { type: 'Alert', message: msg });
  }
}
