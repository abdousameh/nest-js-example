import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { LoggerService } from '../../logger/logger.service';
import { CHAT_PORT } from '../../config/global.env';
import { DateTool } from '../../shared/tools/date.tool';

@WebSocketGateway(CHAT_PORT, { namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
  private readonly logger = new LoggerService(ChatGateway.name);

  @WebSocketServer() wss: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: any) {
    this.logger.setMethod(this.afterInit.name);
    this.logger.debug('Websocket server initialized!');
  }

  @SubscribeMessage('chatToServer')
  handleMessage(
    client: Socket,
    payload: { sender: string; room: string; hour: string; message: string },
  ) {
    this.logger.setMethod(this.handleMessage.name);
    this.logger.debug(
      `Message on room ${payload.room} sent by ${payload.sender}: ${payload.message}`,
    );
    payload.hour = DateTool.fmtFullHour(new Date());
    this.wss.to(payload.room).emit('chatToClient', payload);
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinChatRoom(
    client: Socket,
    payload: { room: string; username: string },
  ) {
    this.logger.setMethod(this.handleJoinChatRoom.name);
    if (payload.username && payload.room) {
      this.logger.debug(
        `The player ${payload.username} has joined the room ${payload.room}`,
      );
    }
    client.join(payload.room);
    client.emit('joinedRoom', payload.room);
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveChatRoom(
    client: Socket,
    payload: { room: string; username: string },
  ) {
    this.logger.setMethod(this.handleLeaveChatRoom.name);
    if (payload.username && payload.room) {
      this.logger.debug(
        `The player ${payload.username} has left the room ${payload.room}`,
      );
      client.leave(payload.room);
    }
    client.emit('leftRoom', payload.room);
  }
}
