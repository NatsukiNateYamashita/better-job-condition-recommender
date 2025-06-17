'use client';

import React from 'react';
import { Recommendation } from '../types';
import { Sparkles, ChevronRight, CheckCircle, ArrowRight, AlertTriangle, SlidersHorizontal as SliderHorizontal } from 'lucide-react';

interface RequirementCombinationPanelProps {
  recommendations: Recommendation[];
  onApplyCombination: (recommendation: Recommendation) => void;
  matchPercentage: number;
}

const RequirementCombinationPanel: React.FC<RequirementCombinationPanelProps> = ({
  recommendations,
  onApplyCombination,
  matchPercentage
}) => {
  // Helper function to format parameter names in Japanese
  const formatParameter = (param: string): string => {
    const paramMap: Record<string, string> = {
      'jobType.major': '職種大',
      'jobType.middle': '職種中',
      'jobType.minor': '職種小',
      'hourlyWage': '時給',
      'workArea.prefecture': '都道府県',
      'workArea.city': '市区町村',
      'skillRequirements': 'スキル要件',
      'workHours': '勤務時間',
      'workDays': '勤務曜日',
      'dependentStatus': '被扶養希望'
    };
    return paramMap[param] || param;
  };

  // Helper function to format values
  const formatValue = (param: string, value: any): string => {
    if (param === 'hourlyWage') {
      return `${value.toLocaleString()}円`;
    }
    if (Array.isArray(value)) {
      return value.length > 3 ? `${value.slice(0, 3).join('、')}...` : value.join('、');
    }
    if (typeof value === 'boolean') {
      return value ? '希望する' : '希望しない';
    }
    return String(value);
  };

  // 80%以上の組み合わせのみ抽出
  const combinationRecs = recommendations.filter(
    rec => rec.parameter === 'combined' && rec.changes && rec.changes.length > 1
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          オススメ条件調整組み合わせ
        </h2>
      </div>
      <div className="p-6">
        {matchPercentage >= 80 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">マッチ率80%以上を達成しています</p>
          </div>
        ) : combinationRecs.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">
              条件が人財プールと大きく乖離しています。条件を根本的に見直す必要があります。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {combinationRecs.map((rec, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <SliderHorizontal className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-800 text-sm">
                      マッチ率80%以上にするための条件の組み合わせ
                    </span>
                  </div>
                  <div className="text-sm font-medium px-2 py-1 rounded bg-green-100 text-green-800">
                    +{rec.potentialIncrease.toFixed(1)}%
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  {rec.changes?.map((change, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4 text-sm items-center">
                      <div>
                        <div className="text-gray-500 mb-1">{formatParameter(change.parameter)} 現在</div>
                        <div className="font-medium">{formatValue(change.parameter, change.currentValue)}</div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">変更後</div>
                        <div className="font-medium text-blue-700">{formatValue(change.parameter, change.suggestedValue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">
                    マッチ率80%以上達成のための推奨組み合わせ
                  </span>
                  <button
                    onClick={() => onApplyCombination(rec)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <span>この組み合わせを適用</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementCombinationPanel;
