import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { DepositsModule } from "../deposits/deposits.module";
import { WithdrawalsModule } from "../withdrawals/withdrawals.module";

@Module({
  imports: [DepositsModule, WithdrawalsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
