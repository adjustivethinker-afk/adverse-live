import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class SendMessageDto {
  @ApiProperty({ description: "Message text" })
  @IsString()
  @MaxLength(4000)
  body!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiProperty({ required: false, description: "image | audio | video | file" })
  @IsOptional()
  @IsString()
  attachmentKind?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  replyToId?: string;
}
