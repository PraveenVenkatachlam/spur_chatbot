import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message, FaqKnowledge } from '../database/entities';
import { LlmService } from '../llm/llm.service';
import { ChatResponseDto, ConversationHistoryDto } from './dto/chat-response.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(FaqKnowledge)
    private faqRepo: Repository<FaqKnowledge>,
    private llmService: LlmService,
  ) {}

  async processMessage(userMessage: string, sessionId?: string): Promise<ChatResponseDto> {
    // Get or create conversation
    let conversation: Conversation | null = null;

    if (sessionId) {
      conversation = await this.conversationRepo.findOne({ where: { id: sessionId } });
    }

    if (!conversation) {
      conversation = this.conversationRepo.create({
        id: sessionId || uuidv4(),
        metadata: { source: 'web' },
      });
      await this.conversationRepo.save(conversation);
    }

    // Save user message
    await this.messageRepo.save({
      conversationId: conversation.id,
      sender: 'user',
      text: userMessage,
    });

    // Get conversation history
    const messages = await this.messageRepo.find({
      where: { conversationId: conversation.id },
      order: { timestamp: 'ASC' },
      take: 20,
    });

    //  FIXED: Convert 'ai' to 'assistant' for OpenAI compatibility
    const history = messages.map((m) => ({
      role: (m.sender === 'ai' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.text,
    }));

    // Get FAQ knowledge
    const faqKnowledge = await this.getFaqKnowledge();

    // Generate AI reply
    const aiReply = await this.llmService.generateReply(history, userMessage, faqKnowledge);

    // Save AI message
    const aiMessage = await this.messageRepo.save({
      conversationId: conversation.id,
      sender: 'ai',
      text: aiReply,
    });

    return {
      reply: aiReply,
      sessionId: conversation.id,
      messageId: aiMessage.id,
      timestamp: aiMessage.timestamp,
    };
  }

  async getConversationHistory(sessionId: string): Promise<ConversationHistoryDto | null> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: sessionId },
    });

    if (!conversation) return null;

    const messages = await this.messageRepo.find({
      where: { conversationId: sessionId },
      order: { timestamp: 'ASC' },
    });

    return {
      sessionId: conversation.id,
      messages: messages.map((m) => ({
        id: m.id,
        sender: m.sender as 'user' | 'ai',
        text: m.text,
        timestamp: m.timestamp,
      })),
      createdAt: conversation.createdAt,
    };
  }

  private async getFaqKnowledge(): Promise<string> {
    const faqs = await this.faqRepo.find({ order: { priority: 'DESC' } });

    if (faqs.length === 0) {
      return `
## Shipping
- Free shipping on orders over $50
- Standard: 5-7 business days
- Express: 2-3 business days ($9.99)

## Returns
- 30-day return policy
- Items must be unused in original packaging
- Refunds processed in 5-7 business days

## Support
- Hours: Mon-Fri, 9 AM - 6 PM EST
- Email: support@example-store.com
- Phone: 1-800-EXAMPLE
      `;
    }

    return faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
  }
}