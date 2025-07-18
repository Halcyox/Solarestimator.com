'use client';

import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useChatController } from '../../controllers/chatController';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { QuickActions } from './QuickActions';

const QUICK_ACTIONS = [
  "How much can I save with solar?",
  "What size system do I need?",
  "How does the installation process work?",
  "What are the environmental benefits?"
];

interface SolarChatbotProps {
  onStartEstimate: () => void;
}

export const SolarChatbot: React.FC<SolarChatbotProps> = ({ onStartEstimate }) => {
  const {
    messages,
    isLoading,
    isExpanded,
    inputMessage,
    error,
    sendMessage,
    setInputMessage,
    toggleExpanded,
    clearError,
    handleQuickAction,
    messagesEndRef,
    inputRef
  } = useChatController({ onStartEstimate });

  // Basic event isolation for the chatbot container
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleExpanded();
  };

  if (!isExpanded) {
    // Collapsed view - shows just the initial message
    return (
      <div 
        className="mt-6 max-w-md mx-auto solar-chatbot-container"
        onClick={handleContainerClick}
        style={{ 
          isolation: 'isolate',
          contain: 'layout style paint'
        }}
      >
        <div className="flex items-start space-x-3">
          {/* Bot Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center shadow-md">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          {/* Message Bubble */}
          <div 
            className="relative bg-gray-100 p-4 rounded-lg rounded-tl-none shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleToggleClick}
          >
            {/* Triangle Pointer */}
            <div className="absolute -left-2 top-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-100"></div> 
            
            <p className="font-sans text-sm text-gray-700 leading-relaxed">
              {messages[0]?.content || "Hi, I'm Solar! Click to chat with me about solar energy!"}
            </p>
            
            {/* Click to chat indicator */}
            <div className="mt-3 border-t border-gray-200 pt-2 flex items-center justify-between">
              <p className="text-xs text-gray-400 italic">Click to chat with me!</p>
              <ChatBubbleLeftIcon className="w-4 h-4 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expanded chat view
  return (
    <div 
      className="mt-6 max-w-md mx-auto solar-chatbot-container"
      onClick={handleContainerClick}
      style={{ 
        isolation: 'isolate',
        contain: 'layout style paint'
      }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-[32rem] flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Solar AI Assistant</h3>
              <p className="text-white/80 text-xs">Ask me about solar energy!</p>
            </div>
          </div>
          <button 
            onClick={handleToggleClick}
            className="text-white/80 hover:text-white text-lg font-bold w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-2 mx-3 mt-2">
            <div className="flex justify-between items-center">
              <p className="text-red-700 text-xs">{error}</p>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearError();
                }}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        {/* Quick Actions - only show for initial conversation */}
        <QuickActions
          actions={QUICK_ACTIONS}
          onActionClick={handleQuickAction}
          disabled={isLoading}
          show={messages.length === 1}
        />

        {/* Input Area */}
        <div className="chat-input-form">
          <ChatInput
            input={inputMessage}
            handleInputChange={(e) => setInputMessage(e.target.value)}
            handleSubmit={() => sendMessage()}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}; 