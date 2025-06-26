'use client';

import { useState } from 'react';

interface ApiResponse {
  success: boolean;
  output?: string;
  error?: string;
}

export default function ApiPanel() {
  const [outputs, setOutputs] = useState({
    embedding: 'No output yet...',
    answer: 'No output yet...',
    search: 'No output yet...',
    databricks: 'No output yet...'
  });
  
  const [loading, setLoading] = useState({
    embedding: false,
    answer: false,
    search: false,
    databricks: false
  });

  const handleApiCall = async (apiType: keyof typeof outputs, endpoint: string) => {
    setLoading(prev => ({ ...prev, [apiType]: true }));
    setOutputs(prev => ({ ...prev, [apiType]: 'Loading...' }));
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log(`API Response for ${apiType}:`, data);
      
      if (data.success) {
        console.log(`Setting output for ${apiType}:`, data.output);
        setOutputs(prev => {
          const newOutputs = {
            ...prev,
            [apiType]: data.output || 'No output received'
          };
          console.log(`Updated outputs:`, newOutputs);
          return newOutputs;
        });
      } else {
        setOutputs(prev => ({
          ...prev,
          [apiType]: `❌ Error: ${data.error || 'Unknown error'}`
        }));
      }
    } catch (error) {
      setOutputs(prev => ({
        ...prev,
        [apiType]: `❌ Error: ${error instanceof Error ? error.message : 'Network error'}`
      }));
    } finally {
      setLoading(prev => ({ ...prev, [apiType]: false }));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Azure API Test Panel
      </h2>
      
      {/* API Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => handleApiCall('embedding', '/api/generate-embedding')}
          disabled={loading.embedding}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {loading.embedding ? '⏳ Loading...' : '🔢 Generate Embedding'}
        </button>
        
        <button
          onClick={() => handleApiCall('answer', '/api/generate-answer')}
          disabled={loading.answer}
          className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {loading.answer ? '⏳ Loading...' : '💬 Generate Answer'}
        </button>
        
        <button
          onClick={() => handleApiCall('search', '/api/azure-search')}
          disabled={loading.search}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {loading.search ? '⏳ Loading...' : '🔍 Azure Search'}
        </button>
        
        <button
          onClick={() => handleApiCall('databricks', '/api/databricks-query')}
          disabled={loading.databricks}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {loading.databricks ? '⏳ Loading...' : '📊 Databricks Query'}
        </button>
      </div>

      {/* Output Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Embedding Output</h3>
          <textarea
            value={outputs.embedding}
            readOnly
            className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono resize-none"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Chat Answer Output</h3>
          <textarea
            value={outputs.answer}
            readOnly
            className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm resize-none"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Azure Search Output</h3>
          <textarea
            value={outputs.search}
            readOnly
            className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono resize-none"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Databricks Output</h3>
          <textarea
            value={outputs.databricks}
            readOnly
            className="w-full h-48 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono resize-none"
          />
        </div>
      </div>
    </div>
  );
}
