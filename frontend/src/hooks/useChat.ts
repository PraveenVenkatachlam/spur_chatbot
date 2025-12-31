'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message } from '../types';
import { sendMessage as sendMessageApi, getConversation } from '../services/api';

const STORAGE_KEY = 'spur_chat_session';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  sender: 'ai',
  text: "👋 Hi there! I'm Alex, your support assistant for spurnow Store.\n\nHow can I help you today?\n\n• 🚚 Shipping & delivery\n• ↩️ Returns & refunds\n• 📦 Order tracking\n• 💳 Payment questions\n• ❓ General inquiries",
  timestamp: new Date(),
  status: 'sent',
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load existing conversation on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadConversation = async () => {
      try {
        const storedSessionId = localStorage.getItem(STORAGE_KEY);
        
        if (storedSessionId) {
          const data = await getConversation(storedSessionId);
          
          if (data?.messages?.length) {
            setSessionId(storedSessionId);
            setMessages([
              WELCOME_MESSAGE,
              ...data.messages.map((m) => ({
                id: m.id,
                sender: m.sender as 'user' | 'ai',
                text: m.text,
                timestamp: new Date(m.timestamp),
                status: 'sent' as const,
              })),
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load conversation:', err);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsInitialized(true);
      }
    };

    loadConversation();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText || isLoading) return;

      // Create user message
      const userMessageId = `user-${Date.now()}`;
      const userMessage: Message = {
        id: userMessageId,
        sender: 'user',
        text: trimmedText,
        timestamp: new Date(),
        status: 'sending',
      };

      // Add user message to state
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Send to API
        const response = await sendMessageApi(trimmedText, sessionId || undefined);

        // Save session ID
        setSessionId(response.sessionId);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, response.sessionId);
        }

        // Create AI message
        const aiMessage: Message = {
          id: response.messageId,
          sender: 'ai',
          text: response.reply,
          timestamp: new Date(response.timestamp),
          status: 'sent',
        };

        // Update messages
        setMessages((prev) =>
          prev
            .map((m) =>
              m.id === userMessageId ? { ...m, status: 'sent' as const } : m
            )
            .concat(aiMessage)
        );
      } catch (err) {
        console.error('Send message error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);

        // Mark user message as failed
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessageId ? { ...m, status: 'error' as const } : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, isLoading]
  );

  const startNewChat = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setSessionId(null);
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find(
      (m) => m.sender === 'user' && m.status === 'error'
    );

    if (lastUserMessage) {
      // Remove failed message
      setMessages((prev) => prev.filter((m) => m.id !== lastUserMessage.id));
      // Retry sending
      sendMessage(lastUserMessage.text);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    isInitialized,
    sendMessage,
    startNewChat,
    clearError,
    retryLastMessage,
  };
}