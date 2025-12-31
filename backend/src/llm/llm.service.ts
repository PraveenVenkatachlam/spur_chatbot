import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable()
export class LlmService {
  private groq: Groq;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GROQ_API_KEY');

    if (!apiKey) {
      console.error('⚠️ WARNING: GROQ_API_KEY is missing in .env file!');
    }

    this.groq = new Groq({ apiKey: apiKey || '' });
  }

  private readonly SYSTEM_PROMPT = `You are Alex, a friendly and helpful customer support assistant for spurnow Store, a small e-commerce company.

## STORE INFORMATION:

### 🚚 SHIPPING POLICY:
- Free shipping on orders over $50
- Standard shipping: 5-7 business days
- Express shipping: 2-3 business days ($9.99)
- We ship to US, Canada, UK, Australia, and most of Europe
- International shipping: 10-14 business days

### ↩️ RETURN POLICY:
- 30-day return window
- Items must be unused and in original packaging
- Refunds processed within 5-7 business days
- Free return shipping for defective items
- Store credit available for change-of-mind returns

### 💳 PAYMENT METHODS:
- Visa, MasterCard, American Express, Discover
- PayPal, Apple Pay, Google Pay
- All transactions are secure and encrypted

### 🕐 SUPPORT HOURS:
- Chat: 24/7 (AI-powered)
- Phone: Monday-Friday, 9 AM - 6 PM EST
- Email: support@spurnow.com (24hr response)

### 🎉 CURRENT PROMOTIONS:
- 10% off first order with newsletter signup
- Free shipping on orders over $50

## INSTRUCTIONS:
- Be friendly, helpful, and concise
- Use emojis appropriately to be warm and approachable
- If asked about specific order details, ask for the order number
- If you don't know something specific, be honest and offer to connect them with human support
- Keep responses focused and not too long
- Answer the specific question asked, don't just dump all information`;

  async generateReply(
    history: ChatMessage[],
    userMessage: string,
    faqKnowledge?: string,
  ): Promise<string> {
    try {
      // Build messages array
      const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: 'system', content: this.SYSTEM_PROMPT },
      ];

      // Add conversation history (last 10 messages)
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }

      // Add current user message
      messages.push({ role: 'user', content: userMessage });

      // Call Groq API
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',  // ✅ UPDATED MODEL
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const reply = response.choices[0]?.message?.content;

      if (!reply) {
        return this.getFallbackResponse();
      }

      return reply;
    } catch (error: unknown) {
      console.error('Groq API Error:', error);
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): string {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('LLM Error Details:', errorMessage);

    if (errorMessage.includes('API') || errorMessage.includes('key')) {
      return "I'm having trouble connecting right now. Please try again later.";
    }

    if (errorMessage.includes('rate') || errorMessage.includes('limit')) {
      return "We're experiencing high traffic. Please wait a moment and try again! 🙏";
    }

    return this.getFallbackResponse();
  }

  private getFallbackResponse(): string {
    return "I apologize, but I'm having trouble right now. 😔\n\nYou can:\n• Try again in a moment\n• Email us at support@spurnow.com\n\nSorry for the inconvenience!";
  }
}
