import React from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { ChatController } from '../../controllers/chatController';

interface ChatWindowProps {
  controller: ChatController;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ controller }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    controller.setInputMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    controller.sendMessage();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 h-[32rem] flex flex-col border border-gray-200">
      <div className="bg-gray-800 text-white p-3 rounded-t-lg">
        <h2 className="text-lg font-semibold text-center">Solar AI Assistant</h2>
      </div>
      <ChatMessages 
        messages={controller.messages} 
        messagesEndRef={controller.messagesEndRef} 
        isLoading={controller.isLoading}
      />
      <ChatInput
        input={controller.inputMessage}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={controller.isLoading}
      />
    </div>
  );
}; 