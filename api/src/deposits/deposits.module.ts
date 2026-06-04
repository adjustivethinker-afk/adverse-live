import { Module } from "@nestjs/common";
import { DepositsController } from "./deposits.controller";
import { DepositsService } from "./deposits.service";
import { WalletModule } from "../wallet/wallet.module";

@Module({
  imports: [WalletModule],
  controllers: [DepositsController],
  providers: [DepositsService],
  exports: [DepositsService],
})
export class DepositsModule {}
