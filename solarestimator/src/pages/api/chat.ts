import type { NextApiRequest, NextApiResponse } from 'next';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { Stream } from '@cerebras/cerebras_cloud_sdk/streaming';
import { ChatCompletion } from '@cerebras/cerebras_cloud_sdk/resources/chat/completions';

type ResponseData = {
  message: string;
  conversationHistory?: any[];
  error?: string;
};

const cerebras = new Cerebras({
  apiKey: process.env.NEXT_PUBLIC_CEREBRAS_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const systemPrompt = `You are Solar, an AI assistant for a solar energy estimation website. Your role is to help users understand solar energy, guide them through the estimation process, and answer questions about solar installations, savings, and benefits. Key guidelines: Be friendly, helpful, and knowledgeable. Keep responses concise. If asked about specific calculations, explain the methodology clearly.`;

    const messages: any[] = [
        {
            "role": "system",
            "content": systemPrompt
        }
    ];

    conversationHistory.forEach((msg: any) => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    messages.push({ role: 'user', content: message });


    const stream: Stream<ChatCompletion> = await cerebras.chat.completions.create({
        messages: messages,
        model: 'llama-4-scout-17b-16e-instruct',
        stream: true,
        max_completion_tokens: 2048,
        temperature: 0.2,
        top_p: 1
    });

    let responseText = '';
    for await (const chunk of stream) {
        responseText += (chunk as any).choices[0]?.delta?.content || '';
    }

    const newConversationHistory = [
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: responseText }
    ];

    res.status(200).json({
      message: responseText,
      conversationHistory: newConversationHistory
    });

  } catch (error) {
    console.error('Chat API error:', error);
    const fallbackResponse = "I'm here to help with your solar questions! While I'm experiencing a brief technical issue, I'd be happy to help you get started with your solar estimate.";
    res.status(500).json({
      message: fallbackResponse,
      conversationHistory: [
        ...(req.body.conversationHistory || []),
        { role: 'user', content: req.body.message },
        { role: 'assistant', content: fallbackResponse }
      ]
    });
  }
} 