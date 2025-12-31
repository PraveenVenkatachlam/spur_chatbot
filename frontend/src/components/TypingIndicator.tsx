import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2 md:gap-3">
      {/* Avatar */}
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-base md:text-lg flex-shrink-0 shadow-md">
        🤖
      </div>

      {/* Typing Bubble */}
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-delay-1"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-delay-2"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-delay-3"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;