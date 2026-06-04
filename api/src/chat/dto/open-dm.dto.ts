import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class OpenDmDto {
  @ApiProperty({ description: "Other user id" })
  @IsString()
  @MinLength(1)
  userId!: string;
}
