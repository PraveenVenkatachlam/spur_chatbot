import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body() dto: SendMessageDto) {
    try {
      return await this.chatService.processMessage(dto.message, dto.sessionId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to process message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('conversation/:sessionId')
  async getConversation(@Param('sessionId') sessionId: string) {
    const result = await this.chatService.getConversationHistory(sessionId);
    if (!result) {
      throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}