'use client';

import React, { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<Props> = ({ onSend, disabled = false }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isButtonDisabled = !text.trim() || disabled;

  return (
    <form onSubmit={handleSubmit} className="p-3 md:p-4 bg-white border-t border-gray-100">
      <div className="flex items-center gap-2 md:gap-3 bg-gray-100 rounded-full px-3 md:px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          maxLength={4000}
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
            !isButtonDisabled
              ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {disabled ? (
            <svg className="w-4 h-4 md:w-5 md:h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-2 hidden md:block">
        Press Enter to send
      </p>
    </form>
  );
};

export default ChatInput;