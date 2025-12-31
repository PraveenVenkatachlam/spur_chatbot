import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty' })
  @MaxLength(4000)
  @Transform(({ value }) => value?.trim())
  message: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}