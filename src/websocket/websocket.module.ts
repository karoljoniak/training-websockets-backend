import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

/** Moduł grupujący gateway — rejestrujemy go w AppModule. */
@Module({
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
