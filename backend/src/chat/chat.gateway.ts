import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Role } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { ChatsService } from 'src/chats/chats.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatsService) {}
  @WebSocketServer()
  server: Server;

  // Map userId to socketId
  private users = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.users.entries()) {
      if (socketId === client.id) {
        this.users.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('registerUser')
  handleRegisterUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    try {
      const { userId } = data;

      if (!userId) {
        throw new WsException('Missing userId in registerUser payload');
      }

      console.log(`Registering user ${userId} with socket ${client.id}`);
      this.users.set(userId, client.id);
    } catch (err) {
      console.error('Error in registerUser:', err);
      if (!(err instanceof WsException)) {
        throw new WsException('Internal server error during user registration');
      }
      throw err;
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      sender: Role;
      receiverId: string;
      content: string;
      senderId: string;
    },
  ) {
    try {
      const { sender, receiverId, content, senderId } = data;

      if (!sender || !receiverId || !content || !senderId) {
        throw new WsException('Invalid message data');
      }

      console.log(`Message from ${sender} to ${receiverId}: ${content}`);

      const receiverSocketId = this.users.get(receiverId);

      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('receiveMessage', {
          sender,
          content,
        });
      }

      this.chatService.create({
        sender,
        content,
        receiverId,
        senderId: senderId,
      });
    } catch (err) {
      console.error('Error in sendMessage:', err);
      if (!(err instanceof WsException)) {
        throw new WsException('Internal server error during message send');
      }
      throw err;
    }
  }
}
