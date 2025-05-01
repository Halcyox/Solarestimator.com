import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid'; // Using solid sparkles for the bot icon

export const ChatbotMockup: React.FC = () => {
  return (
    <div className="mt-6 max-w-md mx-auto">
      <div className="flex items-start space-x-3">
        {/* Bot Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center shadow-md">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        {/* Message Bubble */}
        <div className="relative bg-gray-100 p-4 rounded-lg rounded-tl-none shadow-sm border border-gray-200">
          {/* Triangle Pointer */}
          <div className="absolute -left-2 top-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-100"></div> 
          
          <p className="font-sans text-sm text-gray-700 leading-relaxed">
            Hi, I'm <strong className="font-semibold text-orange-600">Solar</strong>! 👋 Need help? Ask me anything about your estimate or how our AI can guide you to the best solar solution and save you money!
          </p>
           {/* Mock Input Area */}
           <div className="mt-3 border-t border-gray-200 pt-2">
                <p className="text-xs text-gray-400 italic">Chatbot interface is for illustrative purposes.</p>
           </div>
        </div>
      </div>
    </div>
  );
}; 