import { Module } from "@nestjs/common";
import { QuizController } from "./quiz.controller";
import { QuizService } from "./quiz.service";
import { WalletModule } from "../wallet/wallet.module";
import { ReferralsModule } from "../referrals/referrals.module";

@Module({
  imports: [WalletModule, ReferralsModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
