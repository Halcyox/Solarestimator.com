import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SolarAnalysisData {
  address?: string;
  monthlyBill?: number;
  propertyType?: string;
  roofAge?: number;
  utilityProvider?: string;
}

export interface SolarEstimates {
  annualUsage: number;
  estimatedSystemSize: number;
  estimatedSavings: number;
  monthlySavings: number;
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: string;
  estimates?: SolarEstimates;
  error?: string;
}

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Initialize on client side only
      if (typeof window !== 'undefined') {
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      this.isInitialized = false;
    }
  }

  async sendChatMessage(
    message: string, 
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    console.log('🔧 GeminiService.sendChatMessage called');
    console.log('📝 Message:', message.substring(0, 50) + '...');
    console.log('📚 History length:', conversationHistory.length);
    
    if (!this.isInitialized) {
      console.log('❌ Service not initialized');
      return {
        success: false,
        error: 'Service not initialized'
      };
    }

    try {
      console.log('🌐 Making fetch request to /api/chat');
      
      const requestBody = {
        message,
        conversationHistory: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      };
      
      console.log('🔬 Pre-serialization check. Type of message:', typeof message, 'Is message null/undefined:', message === null || message === undefined);
      console.log('🔬 Pre-serialization check. History is Array:', Array.isArray(conversationHistory));
      console.log('📤 Raw Request Body Object:', requestBody);

      const jsonBody = JSON.stringify(requestBody);
      console.log('📄 Stringified JSON Body:', jsonBody);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonBody,
      });

      console.log('📨 Fetch response status:', response.status);
      console.log('📨 Fetch response ok:', response.ok);

      if (!response.ok) {
        console.error('❌ HTTP error! status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Response data:', {
        hasMessage: !!data.message,
        hasError: !!data.error,
        messageLength: data.message?.length
      });

      // Handle error response
      if (data.error) {
        console.log('❌ API returned error:', data.error);
        return {
          success: false,
          error: data.error,
          message: data.message || "I'm here to help with your solar questions! While I'm experiencing a brief technical issue, I'd be happy to help you get started with your solar estimate."
        };
      }

      // Handle successful response
      if (data.message) {
        console.log('✅ Successful response received');
        return {
          success: true,
          message: data.message
        };
      }

      // Fallback for unexpected response format
      console.log('⚠️ Unexpected response format');
      return {
        success: false,
        error: 'Unexpected response format'
      };
    } catch (error) {
      console.error('💥 Chat service error:', error);
      return {
        success: false,
        error: 'Failed to send message. Please try again.',
        message: "I'm here to help with your solar questions! While I'm experiencing a brief technical issue, I'd be happy to help you get started with your solar estimate."
      };
    }
  }

  async getSolarAnalysis(
    data: SolarAnalysisData,
    question?: string
  ): Promise<AnalysisResponse> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: 'Service not initialized'
      };
    }

    try {
      const response = await fetch('/api/solar-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          question
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        success: result.success,
        analysis: result.analysis,
        estimates: result.estimates,
        error: result.error
      };
    } catch (error) {
      console.error('Solar analysis service error:', error);
      return {
        success: false,
        error: 'Failed to get solar analysis. Please try again.',
        analysis: "I'd be happy to help analyze your solar potential! Please share your address and monthly electric bill to get personalized recommendations."
      };
    }
  }

  generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createMessage(role: 'user' | 'assistant', content: string): ChatMessage {
    return {
      id: this.generateMessageId(),
      role,
      content,
      timestamp: new Date()
    };
  }
}

// Export singleton instance
export const geminiService = new GeminiService(); 