export interface ChatResponseDto {
  reply: string;
  sessionId: string;
  messageId: string;
  timestamp: Date;
}

export interface MessageDto {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface ConversationHistoryDto {
  sessionId: string;
  messages: MessageDto[];
  createdAt: Date;
}