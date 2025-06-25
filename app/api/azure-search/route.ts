import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';

// 開発環境でのSSL証明書問題を解決
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function POST(request: NextRequest) {
  try {
    const credential = new AzureKeyCredential(process.env.AZURE_SEARCH_API_KEY!);
    
    const searchClient = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      process.env.AZURE_SEARCH_INDEX_NAME!,
      credential
    );

    console.log('Attempting Azure Search with:', {
      endpoint: process.env.AZURE_SEARCH_ENDPOINT,
      indexName: process.env.AZURE_SEARCH_INDEX_NAME,
      query: 'VBA',
      environment: process.env.NODE_ENV,
      tlsReject: process.env.NODE_TLS_REJECT_UNAUTHORIZED
    });

    // Flaskのapp.pyと同じパラメータを使用
    const searchResults = await searchClient.search('VBA', {
      select: ['adc_category_c', 'chunk'],
      top: 5
    });

    const results = [];
    let count = 0;
    for await (const result of searchResults.results) {
      if (count >= 3) break; // Flaskと同じ制限
      results.push(result);
      count++;
    }

    console.log('Azure Search successful:', {
      resultsLength: results.length
    });

    // Flaskのフォーマットに合わせて出力を整形
    const output_lines = [];
    results.forEach((r, i) => {
      output_lines.push(`_____${i}_____`);
      Object.entries(r.document).forEach(([k, v]) => {
        output_lines.push(`${k}: ${v}`);
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        results: results,
        formatted_output: output_lines
      }
    });
  } catch (error) {
    console.error('Azure Search error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? (error as any).code : 'NO_CODE',
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error && 'code' in error ? (error as any).code : 'NO_CODE';
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to perform search: ${errorMessage}`,
        errorCode: errorDetails
      },
      { status: 500 }
    );
  }
}