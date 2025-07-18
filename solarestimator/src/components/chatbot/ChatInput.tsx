'use client';

import React from 'react';
import { SendIcon, SpinnerIcon } from '../icons/Icons';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ input, handleInputChange, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me about solar energy..."
          className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-900"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || !input.trim()}
          style={{ top: '50%', transform: 'translateY(-50%)', right: '4px' }}
        >
          {isLoading ? <SpinnerIcon className="animate-spin" /> : <SendIcon />}
        </button>
      </div>
    </form>
  );
}; 