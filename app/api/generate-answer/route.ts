import { NextRequest, NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';

export async function POST(request: NextRequest) {
  try {
    const client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION_CHAT,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    });

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_CHAT_MODEL || 'o3-mini',
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "I am going to Paris, what should I see?" }
      ],
      max_completion_tokens: 800,
      temperature: 1.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    return NextResponse.json({
      success: true,
      data: response.choices[0]?.message?.content || 'No response generated'
    });
  } catch (error) {
    console.error('Chat completion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate answer' },
      { status: 500 }
    );
  }
}
