import React, { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  typingUsers: Array<{ userId: string; username: string }>;
  className?: string;
}

export function TypingIndicator({ typingUsers, className = '' }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  const usersList = typingUsers.map((u) => u.username).join(', ');
  const isMultiple = typingUsers.length > 1;

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className=\"\">\n        {usersList} {isMultiple ? 'are' : 'is'} typing...\n      </span>\n    </div>\n  );\n}\n