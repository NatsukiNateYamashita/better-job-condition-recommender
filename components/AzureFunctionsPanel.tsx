'use client';

import React, { useState } from 'react';
import { Brain, Search, Database, MessageSquare, Loader2 } from 'lucide-react';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export default function AzureFunctionsPanel() {
  const [outputs, setOutputs] = useState({
    embedding: '',
    answer: '',
    search: '',
    databricks: ''
  });
  
  const [loading, setLoading] = useState({
    embedding: false,
    answer: false,
    search: false,
    databricks: false
  });

  const [databricksAvailable, setDatabricksAvailable] = useState(true);

  const callApi = async (endpoint: string, type: keyof typeof loading) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setOutputs(prev => ({
          ...prev,
          [type]: typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
        }));
      } else {
        setOutputs(prev => ({
          ...prev,
          [type]: `Error: ${result.error}`
        }));
        
        // Databricksが利用できない場合の処理
        if (type === 'databricks' && result.error?.includes('not available')) {
          setDatabricksAvailable(false);
        }
      }
    } catch (error) {
      setOutputs(prev => ({
        ...prev,
        [type]: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const ButtonWithLoader = ({ 
    onClick, 
    isLoading, 
    icon: Icon, 
    children 
  }: { 
    onClick: () => void; 
    isLoading: boolean; 
    icon: React.ElementType; 
    children: React.ReactNode; 
  }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );

  const OutputSection = ({ title, content }: { title: string; content: string }) => (
    content && (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
        <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-auto max-h-32 whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    )
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Brain className="w-5 h-5 text-blue-600" />
        Azure AI 機能
      </h3>
      
      <div className="space-y-4">
        {/* Embedding Generation */}
        <div>
          <ButtonWithLoader
            onClick={() => callApi('generate-embedding', 'embedding')}
            isLoading={loading.embedding}
            icon={Brain}
          >
            Embedding 生成
          </ButtonWithLoader>
          <OutputSection title="Embedding 出力結果:" content={outputs.embedding} />
        </div>

        {/* Chat Completion */}
        <div>
          <ButtonWithLoader
            onClick={() => callApi('generate-answer', 'answer')}
            isLoading={loading.answer}
            icon={MessageSquare}
          >
            Chat回答生成
          </ButtonWithLoader>
          <OutputSection title="Chat 出力結果:" content={outputs.answer} />
        </div>

        {/* Azure AI Search */}
        <div>
          <ButtonWithLoader
            onClick={() => callApi('azure-search', 'search')}
            isLoading={loading.search}
            icon={Search}
          >
            Azure AI Search実行
          </ButtonWithLoader>
          <OutputSection title="Azure AI Search 出力結果:" content={outputs.search} />
        </div>

        {/* Databricks Query - 条件付きで表示 */}
        {databricksAvailable && (
          <div>
            <ButtonWithLoader
              onClick={() => callApi('databricks-query', 'databricks')}
              isLoading={loading.databricks}
              icon={Database}
            >
              Databricks クエリ実行
            </ButtonWithLoader>
            <OutputSection title="Databricks query 出力結果:" content={outputs.databricks} />
          </div>
        )}
      </div>
    </div>
  );
}
