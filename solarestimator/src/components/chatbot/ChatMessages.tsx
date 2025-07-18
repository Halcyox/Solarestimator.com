'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../../services/geminiService';
import { RobotIcon, UserIcon } from '../icons/Icons';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  messagesEndRef
}) => {
  return (
    <div className="chat-messages flex-1 p-4 space-y-4 overflow-y-auto">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
          {msg.role === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <RobotIcon className="w-5 h-5 text-white" />
            </div>
          )}
          <div
            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}
          >
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
          {msg.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white text-gray-700 rounded-lg rounded-bl-none shadow-sm border border-gray-100 p-2 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}; 