import { NextRequest, NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import { configs } from '@/config/azure';

// SSL証明書の検証を無効化
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

export async function POST(req: NextRequest) {
  try {
    const client = new AzureOpenAI({
      apiKey: configs.chat.apiKey,
      apiVersion: configs.chat.apiVersion,
      endpoint: configs.chat.azureEndpoint
    });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "I am going to Paris, what should I see?" }
      ],
      max_completion_tokens: 800,
      temperature: 1.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      model: configs.chat.modelName
    });

    const content = response.choices[0].message.content;

    return NextResponse.json({ 
      success: true, 
      output: content 
    });
  } catch (error) {
    console.error('Chat generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate answer' 
    }, { status: 500 });
  }
}
