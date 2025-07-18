import { useState, useCallback, useRef, useEffect } from 'react';
import { geminiService, ChatMessage, ChatResponse } from '../services/geminiService';

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isExpanded: boolean;
  inputMessage: string;
  error: string | null;
}

export interface ChatActions {
  sendMessage: (messageText?: string) => Promise<void>;
  setInputMessage: (message: string) => void;
  toggleExpanded: () => void;
  clearError: () => void;
  handleQuickAction: (action: string) => void;
}

export interface ChatController extends ChatState, ChatActions {
  messagesEndRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
}

interface UseChatControllerProps {
  onStartEstimate: () => void;
}

export const useChatController = ({ onStartEstimate }: UseChatControllerProps): ChatController => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    geminiService.createMessage(
      'assistant',
      "Hi, I'm Solar! 👋 I'm here to help you understand solar energy and guide you through getting your personalized estimate. Ask me anything about solar panels, savings, or how our process works!"
    )
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    // Only scroll if the chat is expanded and the element exists
    if (isExpanded && messagesEndRef.current) {
      // Find the scrollable parent container (the chat messages area)
      const messagesContainer = messagesEndRef.current.closest('.chat-messages') as HTMLElement;
      
      if (messagesContainer) {
        // Scroll within the chat container, not the entire page
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } else {
        // Fallback: scroll to bottom within the immediate parent
        const parent = messagesEndRef.current.parentElement;
        if (parent) {
          parent.scrollTop = parent.scrollHeight;
        }
      }
    }
  }, [isExpanded]);

  useEffect(() => {
    // Only auto-scroll when chat is expanded
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom, isExpanded]);

  const sendMessage = useCallback(async (messageText?: string) => {
    const messageToSend = messageText || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    // Clear any previous errors
    setError(null);

    const userMessage = geminiService.createMessage('user', messageToSend);
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    
    // Clear input only if using typed message (not quick action)
    if (!messageText) {
      setInputMessage('');
    }
    
    setIsLoading(true);

    // Deep integration logic
    const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop()?.content.toLowerCase() || '';
    const userAffirmative = ['yes', 'yep', 'sure', 'ok', 'okay', 'please do', 'start'].includes(messageToSend.toLowerCase());
    
    if (userAffirmative && lastAssistantMessage.includes('start that process?')) {
      // User wants to start the estimate
      setTimeout(() => {
        onStartEstimate();
        const followUpMessage = geminiService.createMessage('assistant', "Great! I've scrolled you down to the form. Just enter your address to begin.");
        setMessages(prev => [...prev, followUpMessage]);
        setIsLoading(false);
      }, 500);
      return; // Stop further processing
    }

    try {
      // Construct the history to be sent, using the new messages array
      const historyForAPI = newMessages;

      // Send message to AI service
      const response: ChatResponse = await geminiService.sendChatMessage(
        messageToSend,
        historyForAPI
      );

      if (response.success && response.message) {
        const assistantMessage = geminiService.createMessage('assistant', response.message);
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Handle error case
        const errorMessage = response.message || "I'm sorry, I'm having trouble responding right now. Please try again.";
        const assistantMessage = geminiService.createMessage('assistant', errorMessage);
        setMessages(prev => [...prev, assistantMessage]);
        
        if (response.error) {
          setError(response.error);
        }
      }
    } catch (error) {
      console.error('Chat controller error:', error);
      const errorMessage = geminiService.createMessage(
        'assistant',
        "I'm experiencing technical difficulties. Please try again in a moment."
      );
      setMessages(prev => [...prev, errorMessage]);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, messages, onStartEstimate]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => {
      const newExpanded = !prev;
      if (newExpanded) {
        // Focus input when expanding
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      return newExpanded;
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    sendMessage(action);
  }, [sendMessage]);

  return {
    // State
    messages,
    isLoading,
    isExpanded,
    inputMessage,
    error,
    
    // Actions
    sendMessage,
    setInputMessage,
    toggleExpanded,
    clearError,
    handleQuickAction,
    
    // Refs
    messagesEndRef,
    inputRef
  };
}; 