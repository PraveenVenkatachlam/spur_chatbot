export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
  messageId: string;
  timestamp: string;
}

export interface ConversationHistory {
  sessionId: string;
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  timestamp: string;
}