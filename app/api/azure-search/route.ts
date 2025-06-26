import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';
import { configs } from '@/config/azure';
import https from 'https';

// SSL証明書の検証を無効化
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

export async function POST(req: NextRequest) {
  try {
    const credential = new AzureKeyCredential(configs.search.key);
    const client = new SearchClient(
      configs.search.serviceEndpoint,
      configs.search.indexName,
      credential
    );

    const searchResults = await client.search("VBA", {
      select: ["adc_category_c", "chunk"],
      top: 5
    });

    const outputLines: string[] = [];
    let i = 0;
    for await (const result of searchResults.results) {
      if (i >= 3) break;
      outputLines.push(`_____${i}_____`);
      for (const [key, value] of Object.entries(result.document)) {
        outputLines.push(`${key}: ${value}`);
      }
      i++;
    }

    return NextResponse.json({ 
      success: true, 
      output: outputLines.join('\n') 
    });
  } catch (error) {
    console.error('Azure Search error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to search Azure index' 
    }, { status: 500 });
  }
}
