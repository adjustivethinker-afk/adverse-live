import { Body, Controller, Get, Ip, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { QuizService } from "./quiz.service";
import { SubmitQuizDto } from "./dto/submit.dto";

@ApiTags("quiz")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("quiz")
export class QuizController {
  constructor(private quiz: QuizService) {}

  @Get("today")
  @ApiOperation({ summary: "Aaj ka sawaal — agar already attempt kar liya to attempt aur next-available time bhi" })
  today(@CurrentUser() user: { id: string }) {
    return this.quiz.getDailyQuestion(user.id);
  }

  @Post("submit")
  @ApiOperation({ summary: "Aaj ke sawaal ka jawab submit karein" })
  submit(@CurrentUser() user: { id: string }, @Body() dto: SubmitQuizDto, @Ip() ip: string) {
    return this.quiz.submit(user.id, dto.questionId, dto.pickedIndex, { ip });
  }

  @Get("history")
  @ApiOperation({ summary: "User ke pichle quiz attempts" })
  history(@CurrentUser() user: { id: string }, @Query("take") take?: string) {
    return this.quiz.history(user.id, take ? Number(take) : undefined);
  }
}
