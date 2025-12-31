import { ChatResponse, ConversationHistory } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to send message');
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw error;
  }
}

export async function getConversation(
  sessionId: string
): Promise<ConversationHistory | null> {
  try {
    const response = await fetch(`${API_URL}/chat/conversation/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/chat/health`);
    return response.ok;
  } catch {
    return false;
  }
}