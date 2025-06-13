'use client';

import React from 'react';
import { RequirementSimulation, JobRequirement } from '../types';
import { SlidersHorizontal as SliderHorizontal, ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';

interface RequirementSimulatorProps {
  simulations: RequirementSimulation[];
  currentRequirements: JobRequirement;
  onApplySimulation: (simulation: RequirementSimulation) => void;
}

const RequirementSimulator: React.FC<RequirementSimulatorProps> = ({
  simulations,
  currentRequirements,
  onApplySimulation
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
      'workDays': '勤務曜日'
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
    return String(value);
  };

  // Filter out negative simulations
  const positiveSimulations = simulations.filter(sim => sim.percentageIncrease > 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">条件調整シミュレーション</h2>
      </div>
      
      <div className="p-6">
        {positiveSimulations.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">現状の条件が最適です</p>
            <p className="text-sm text-gray-500 mt-1">
              これ以上の条件調整による改善は見込めません
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {positiveSimulations.map((sim, index) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <SliderHorizontal className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-800 text-sm">
                      {formatParameter(sim.parameter)}を調整
                    </span>
                  </div>
                  <div className="text-sm font-medium px-2 py-1 rounded bg-green-100 text-green-800">
                    +{sim.percentageIncrease.toFixed(1)}%
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <div className="text-gray-500 mb-1">現在</div>
                    <div className="font-medium">
                      {formatValue(sim.parameter, sim.currentValue)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div>
                    <div className="text-gray-500 mb-1">変更後</div>
                    <div className="font-medium text-blue-700">
                      {formatValue(sim.parameter, sim.newValue)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">
                    +{sim.matchIncrease}人の候補者増加
                  </span>
                  
                  <button
                    onClick={() => onApplySimulation(sim)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <span>この条件を適用</span>
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

export default RequirementSimulator;