import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LlmModule } from '../llm/llm.module';
import { Conversation, Message, FaqKnowledge } from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, FaqKnowledge]),
    LlmModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}