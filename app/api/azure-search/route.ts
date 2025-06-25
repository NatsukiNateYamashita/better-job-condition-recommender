import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';

export async function POST(request: NextRequest) {
  try {
    const credential = new AzureKeyCredential(process.env.AZURE_SEARCH_API_KEY!);
    
    // SSL証明書問題を解決するためのクライアント設定
    const searchClient = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      process.env.AZURE_SEARCH_INDEX_NAME!,
      credential,
      {
        // 開発環境でのSSL証明書問題を回避
        allowInsecureConnection: process.env.NODE_ENV === 'development',
        retryOptions: {
          maxRetries: 3,
          retryDelayInMs: 1000
        }
      }
    );

    console.log('Attempting Azure Search with:', {
      endpoint: process.env.AZURE_SEARCH_ENDPOINT,
      indexName: process.env.AZURE_SEARCH_INDEX_NAME,
      query: 'VBA'
    });

    const searchResults = await searchClient.search('VBA', {
      top: 5,
      skip: 0,
      includeTotalCount: true,
    });

    const results = [];
    for await (const result of searchResults.results) {
      results.push(result);
    }

    console.log('Azure Search successful:', {
      totalCount: searchResults.count,
      resultsLength: results.length
    });

    return NextResponse.json({
      success: true,
      data: {
        totalCount: searchResults.count,
        results: results
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
