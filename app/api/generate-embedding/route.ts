import { NextRequest, NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import { configs } from '@/config/azure';

// SSL証明書の検証を無効化
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

export async function POST(req: NextRequest) {
  try {
    const client = new AzureOpenAI({
      apiKey: configs.embedding.apiKey,
      apiVersion: configs.embedding.apiVersion,
      endpoint: configs.embedding.azureEndpoint
    });

    const response = await client.embeddings.create({
      input: ["first phrase", "second phrase", "third phrase"],
      model: configs.embedding.modelName
    });

    const outputLines: string[] = [];
    for (const item of response.data) {
      const length = item.embedding.length;
      outputLines.push(
        `data[${item.index}]: length=${length}, ` +
        `[${item.embedding[0]}, ${item.embedding[1]}, ..., ` +
        `${item.embedding[length-2]}, ${item.embedding[length-1]}]`
      );
    }
    outputLines.push(JSON.stringify(response.usage));

    return NextResponse.json({ 
      success: true, 
      output: outputLines.join('\n') 
    });
  } catch (error) {
    console.error('Embedding generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate embedding' 
    }, { status: 500 });
  }
}
