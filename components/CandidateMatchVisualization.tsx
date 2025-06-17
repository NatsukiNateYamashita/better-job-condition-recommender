'use client';

'use client';

import React from 'react';
import { CandidateMatch } from '../types';
import { Users, Percent, ArrowUp, AlertTriangle } from 'lucide-react';

interface CandidateMatchVisualizationProps {
  matchData: CandidateMatch;
  previousMatchData?: CandidateMatch;
}

const CandidateMatchVisualization: React.FC<CandidateMatchVisualizationProps> = ({
  matchData,
  previousMatchData
}) => {
  // Calculate differences if previous data exists
  const matchCountDiff = previousMatchData 
    ? matchData.matchCount - previousMatchData.matchCount
    : 0;
  
  const percentageDiff = previousMatchData
    ? matchData.matchPercentage - previousMatchData.matchPercentage
    : 0;

  // Calculate the fill percentage for the progress bar
  const fillPercentage = Math.min(100, matchData.matchPercentage);
  const isLowMatchRate = matchData.matchPercentage < 80;

  // Calculate advertising cost reduction percentage
  const calculateCostReduction = (matchPercentage: number): number => {
    if (matchPercentage >= 80) return 0;
    // Linear calculation: 80% match rate = 0% reduction needed, 0% match rate = 50% reduction needed
    return Math.round((80 - matchPercentage) * 0.625); // 50/80 = 0.625
  };

  const costReduction = calculateCostReduction(matchData.matchPercentage);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">候補者マッチング</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Low Match Rate Warning */}
        {isLowMatchRate && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 mb-1">マッチ率が80%未満です</p>
                <p className="text-orange-700">
                  条件を調整してみましょう。マッチ率が80%以上の条件に調整すると、広告宣伝費を{costReduction}%削減できます。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Match Count */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">マッチする候補者数</span>
            </div>
            {matchCountDiff !== 0 && (
              <div className={`flex items-center text-sm font-medium ${
                matchCountDiff > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <ArrowUp className={`w-4 h-4 mr-1 ${
                  matchCountDiff < 0 ? 'transform rotate-180' : ''
                }`} />
                <span>{Math.abs(matchCountDiff)}人</span>
              </div>
            )}
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {matchData.matchCount.toLocaleString()}人
            </span>
          </div>
        </div>
        
        {/* Match Percentage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">マッチ率</span>
            </div>
            {percentageDiff !== 0 && (
              <div className={`flex items-center text-sm font-medium ${
                percentageDiff > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <ArrowUp className={`w-4 h-4 mr-1 ${
                  percentageDiff < 0 ? 'transform rotate-180' : ''
                }`} />
                <span>{Math.abs(percentageDiff).toFixed(1)}%</span>
              </div>
            )}
          </div>
          
          <div className="mb-2">
            <span className={`text-3xl font-bold ${
              isLowMatchRate ? 'text-orange-600' : 'text-gray-900'
            }`}>
              {matchData.matchPercentage.toFixed(1)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isLowMatchRate ? 'bg-orange-500' : 'bg-blue-600'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
          
          {/* 80% Target Line */}
          <div className="relative mt-1">
            <div 
              className="absolute top-0 w-0.5 h-2 bg-green-500"
              style={{ left: '80%' }}
            />
            <div 
              className="absolute top-2 text-xs text-green-600 font-medium"
              style={{ left: '80%', transform: 'translateX(-50%)' }}
            >
              目標80%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateMatchVisualization;