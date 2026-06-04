import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Max, Min, MinLength } from "class-validator";

export class SubmitQuizDto {
  @ApiProperty({ description: "Question id from /quiz/today" })
  @IsString()
  @MinLength(1)
  questionId!: string;

  @ApiProperty({ description: "Index of the option the user picked (0-3)" })
  @IsInt()
  @Min(0)
  @Max(10)
  pickedIndex!: number;
}
