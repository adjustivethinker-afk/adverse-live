import { Module } from "@nestjs/common";
import { VoiceRoomsController } from "./voice-rooms.controller";
import { VoiceRoomsService } from "./voice-rooms.service";
import { WalletModule } from "../wallet/wallet.module";

@Module({
  imports: [WalletModule],
  controllers: [VoiceRoomsController],
  providers: [VoiceRoomsService],
  exports: [VoiceRoomsService],
})
export class VoiceRoomsModule {}
