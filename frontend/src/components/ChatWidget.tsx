'use client';

import React from 'react';
import { useChat } from '../hooks/useChat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatWidget: React.FC = () => {
  const {
    messages,
    isLoading,
    error,
    isInitialized,
    sendMessage,
    startNewChat,
    clearError,
    retryLastMessage,
  } = useChat();

  if (!isInitialized) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-white rounded-2xl shadow-2xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] md:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-4 md:px-5 py-3 md:py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-white/20 rounded-full flex items-center justify-center text-xl md:text-2xl">
            🤖
          </div>
          <div className="text-white">
            <h2 className="font-semibold text-base md:text-lg">Support Chat</h2>
            <div className="flex items-center gap-2 text-xs md:text-sm opacity-90">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </div>
          </div>
        </div>

        <button
          onClick={startNewChat}
          className="px-2 md:px-3 py-1 md:py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs md:text-sm font-medium transition-colors"
        >
          New Chat
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-100 px-4 py-2 md:py-3 flex items-center justify-between shrink-0">
          <span className="text-red-600 text-xs md:text-sm flex-1">{error}</span>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600 text-lg md:text-xl leading-none ml-2 px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onRetry={retryLastMessage}
      />

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatWidget;