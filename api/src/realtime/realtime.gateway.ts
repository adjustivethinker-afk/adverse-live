import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

/**
 * AdVerse Live realtime gateway.
 *
 * Channels:
 *  - `user:{id}`             personal events (notifications, wallet updates)
 *  - `room:{roomId}`         voice room presence, chat, gifts, reactions
 *  - `admin:metrics`         admin live metrics
 *
 * Events out:
 *  - notification:new
 *  - wallet:updated
 *  - room:user-joined / room:user-left / room:user-muted
 *  - room:message
 *  - room:gift
 *  - room:reaction
 *  - room:speaker-request / room:speaker-accepted / room:speaker-denied
 *  - voice:offer / voice:answer / voice:ice-candidate (WebRTC signaling)
 */
@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: "/realtime" })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(RealtimeGateway.name);

  handleConnection(socket: Socket) {
    this.logger.log(`socket connected ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`socket disconnected ${socket.id}`);
  }

  @SubscribeMessage("auth")
  handleAuth(@ConnectedSocket() socket: Socket, @MessageBody() data: { userId: string }) {
    if (!data?.userId) return;
    socket.join(`user:${data.userId}`);
    socket.data.userId = data.userId;
  }

  @SubscribeMessage("room:join")
  joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: { roomId: string }) {
    socket.join(`room:${data.roomId}`);
    this.server.to(`room:${data.roomId}`).emit("room:user-joined", { userId: socket.data.userId });
  }

  @SubscribeMessage("room:leave")
  leaveRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: { roomId: string }) {
    socket.leave(`room:${data.roomId}`);
    this.server.to(`room:${data.roomId}`).emit("room:user-left", { userId: socket.data.userId });
  }

  @SubscribeMessage("room:message")
  message(@MessageBody() data: { roomId: string; body: string; userId: string }) {
    this.server.to(`room:${data.roomId}`).emit("room:message", data);
  }

  @SubscribeMessage("room:reaction")
  reaction(@MessageBody() data: { roomId: string; userId: string; emoji: string }) {
    this.server.to(`room:${data.roomId}`).emit("room:reaction", data);
  }

  // WebRTC signaling (peer-to-peer between speakers)
  @SubscribeMessage("voice:offer")
  rtcOffer(@MessageBody() data: { roomId: string; toUserId: string; sdp: any; fromUserId: string }) {
    this.server.to(`user:${data.toUserId}`).emit("voice:offer", data);
  }

  @SubscribeMessage("voice:answer")
  rtcAnswer(@MessageBody() data: { roomId: string; toUserId: string; sdp: any; fromUserId: string }) {
    this.server.to(`user:${data.toUserId}`).emit("voice:answer", data);
  }

  @SubscribeMessage("voice:ice-candidate")
  rtcIce(@MessageBody() data: { roomId: string; toUserId: string; candidate: any; fromUserId: string }) {
    this.server.to(`user:${data.toUserId}`).emit("voice:ice-candidate", data);
  }

  // Server-side push helpers
  pushNotification(userId: string, payload: any) {
    this.server.to(`user:${userId}`).emit("notification:new", payload);
  }

  pushWallet(userId: string, payload: any) {
    this.server.to(`user:${userId}`).emit("wallet:updated", payload);
  }

  pushRoom(roomId: string, event: string, payload: any) {
    this.server.to(`room:${roomId}`).emit(event, payload);
  }
}
