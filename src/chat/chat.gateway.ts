import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.server = server;
  }

  @SubscribeMessage('new-message')
  handleNewMessage(@MessageBody() message: any) {
    console.log(this.server);
  }
}
