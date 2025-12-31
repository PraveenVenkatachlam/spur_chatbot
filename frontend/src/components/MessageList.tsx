'use client';

import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface Props {
  messages: Message[];
  isLoading: boolean;
  onRetry?: () => void;
}

const MessageList: React.FC<Props> = ({ messages, isLoading, onRetry }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50"
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          onRetry={
            message.status === 'error' && index === messages.length - 1
              ? onRetry
              : undefined
          }
        />
      ))}

      {isLoading && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;