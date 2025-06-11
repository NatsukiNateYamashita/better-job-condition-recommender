import React from 'react';
import { Download, Share2, Clipboard } from 'lucide-react';
import { JobRequirement, CandidateMatch } from '../types';

interface ActionPanelProps {
  requirements: JobRequirement;
  matchData: CandidateMatch;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ requirements, matchData }) => {
  const handleExport = () => {
    // Format requirements and match data
    const formattedRequirements = {
      職種大: requirements.jobType.major,
      職種中: requirements.jobType.middle,
      職種小: requirements.jobType.minor.join('、'),
      時給: `${requirements.hourlyWage}円`,
      都道府県: requirements.workArea.prefecture,
      市区町村: requirements.workArea.city.join('、'),
      スキル要件: requirements.skillRequirements.join('、'),
      勤務時間: `${requirements.workHours.start}～${requirements.workHours.end}`,
      勤務曜日: requirements.workDays.join('、'),
      被扶養希望: requirements.dependentStatus ? 'あり' : 'なし'
    };
    
    const formattedMatchData = {
      候補者数: `${matchData.matchCount}/${matchData.totalCount}人`,
      マッチ率: `${matchData.matchPercentage.toFixed(1)}%`
    };
    
    // Create a combined data object
    const exportData = {
      求人条件: formattedRequirements,
      候補者マッチング: formattedMatchData,
      エクスポート日時: new Date().toLocaleString('ja-JP')
    };
    
    // Convert to JSON and create a download link
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = '求人条件分析結果.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleCopyToClipboard = () => {
    // Format a summary text for clipboard
    const summary = `
求人条件分析結果:

【求人条件】
職種大: ${requirements.jobType.major}
職種中: ${requirements.jobType.middle}
職種小: ${requirements.jobType.minor.join('、')}
時給: ${requirements.hourlyWage}円
都道府県: ${requirements.workArea.prefecture}
市区町村: ${requirements.workArea.city.join('、')}
スキル要件: ${requirements.skillRequirements.join('、')}
勤務時間: ${requirements.workHours.start}～${requirements.workHours.end}
勤務曜日: ${requirements.workDays.join('、')}
被扶養希望: ${requirements.dependentStatus ? 'あり' : 'なし'}

【候補者マッチング】
候補者数: ${matchData.matchCount}/${matchData.totalCount}人
マッチ率: ${matchData.matchPercentage.toFixed(1)}%

この条件では${matchData.totalCount}人中${matchData.matchCount}人（${matchData.matchPercentage.toFixed(1)}%）の候補者がマッチします。
    `.trim();
    
    navigator.clipboard.writeText(summary)
      .then(() => {
        alert('クリップボードにコピーしました');
      })
      .catch(err => {
        console.error('クリップボードへのコピーに失敗しました', err);
      });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">アクション</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">データをエクスポート</span>
          </button>
          
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Clipboard className="w-4 h-4" />
            <span className="font-medium">サマリーをコピー</span>
          </button>
          
          <button
            className="flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            <span className="font-medium">クライアントと共有</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;