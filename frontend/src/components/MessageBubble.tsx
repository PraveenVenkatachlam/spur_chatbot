import React from 'react';
import { Message } from '../types';

interface Props {
  message: Message;
  onRetry?: () => void;
}

const MessageBubble: React.FC<Props> = ({ message, onRetry }) => {
  const isUser = message.sender === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-start gap-2 md:gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar - Only for AI */}
      {!isUser && (
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-base md:text-lg shrink-0 shadow-md">
          🤖
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[75%] md:max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`px-3 py-2 md:px-4 md:py-3 whitespace-pre-wrap leading-relaxed text-sm md:text-base ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-sm shadow-md'
              : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm'
          } ${message.status === 'error' ? 'opacity-70' : ''}`}
        >
          {message.text}
        </div>

        {/* Meta Info */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-gray-400">{time}</span>

          {message.status === 'sending' && (
            <span className="text-xs text-gray-400 italic flex items-center gap-1">
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </span>
          )}

          {message.status === 'error' && (
            <button
              onClick={onRetry}
              className="text-xs text-red-500 font-medium hover:text-red-600 flex items-center gap-1"
            >
              <span>Failed</span>
              <span className="underline">Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;