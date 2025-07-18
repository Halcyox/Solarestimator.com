import React from 'react';
import { CloseIcon, MessageIcon } from '../icons/Icons';

interface ChatToggleButtonProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ isExpanded, toggleExpanded }) => {
  return (
    <button
      onClick={toggleExpanded}
      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
      aria-label={isExpanded ? 'Close chat' : 'Open chat'}
    >
      {isExpanded ? <CloseIcon className="w-6 h-6" /> : <MessageIcon className="w-6 h-6" />}
    </button>
  );
}; 