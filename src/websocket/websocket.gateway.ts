import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

/** Jedyna nazwa eventu w tym przykładzie — klient i serwer używają tej samej nazwy. */
export const WEBSOCKET_MESSAGE_EVENT = 'message';

/**
 * Gateway = punkt wejścia WebSocket w NestJS (odpowiednik kontrolera dla HTTP).
 * Dekorator @WebSocketGateway włącza serwer Socket.IO na tym samym porcie co HTTP.
 */
@WebSocketGateway({
  cors: {
    origin: (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim()),
    credentials: true,
  },
})
export class WebsocketGateway {
  private readonly logger = new Logger(WebsocketGateway.name);

  /** Referencja do serwera Socket.IO — przydatna przy broadcastzie do wielu klientów. */
  @WebSocketServer()
  server: Server;

  /**
   * Obsługa jednego eventu: klient wysyła string, serwer zwraca string w odpowiedzi (ack).
   * @MessageBody() — treść wiadomości z klienta (tu: zwykły string).
   * Zwracana wartość trafia z powrotem do klienta jako odpowiedź na to samo wywołanie emit.
   */
  @SubscribeMessage(WEBSOCKET_MESSAGE_EVENT)
  handleMessage(@MessageBody() text: string): string {
    this.logger.log(`Odebrano: ${text}`);
    return `Backend odpowiada na: "${text}"`;
  }
}
