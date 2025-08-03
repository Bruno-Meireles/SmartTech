import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true }) // Habilita CORS para o WebSocket
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  sendNotification(message: string) {
    this.server.emit('notification', message);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    return data;
  }
}
