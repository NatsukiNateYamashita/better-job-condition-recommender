import { NextRequest, NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';

export async function POST(request: NextRequest) {
  try {
    const client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION_EMBEDDING,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    });

    const response = await client.embeddings.create({
      input: ["first phrase", "second phrase", "third phrase"],
      model: process.env.AZURE_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large'
    });

    const outputLines = [];
    for (const item of response.data) {
      outputLines.push(`Index: ${item.index}, Embedding length: ${item.embedding.length}`);
    }
    outputLines.push(`Usage: ${JSON.stringify(response.usage)}`);

    return NextResponse.json({
      success: true,
      data: outputLines.join('\n')
    });
  } catch (error) {
    console.error('Embedding generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate embedding' },
      { status: 500 }
    );
  }
}
