import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { WalletModule } from "./wallet/wallet.module";
import { QuizModule } from "./quiz/quiz.module";
import { ReferralsModule } from "./referrals/referrals.module";
import { VoiceRoomsModule } from "./voice-rooms/voice-rooms.module";
import { DepositsModule } from "./deposits/deposits.module";
import { WithdrawalsModule } from "./withdrawals/withdrawals.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { MissionsModule } from "./missions/missions.module";
import { CommunityModule } from "./community/community.module";
import { AdminModule } from "./admin/admin.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { ChatModule } from "./chat/chat.module";
import { FriendsModule } from "./friends/friends.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    WalletModule,
    QuizModule,
    ReferralsModule,
    VoiceRoomsModule,
    DepositsModule,
    WithdrawalsModule,
    NotificationsModule,
    MissionsModule,
    CommunityModule,
    AdminModule,
    RealtimeModule,
    ChatModule,
    FriendsModule,
    HealthModule,
  ],
})
export class AppModule {}
