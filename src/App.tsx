import React, { useState, useEffect } from 'react';
import JobRequirementsForm from './components/JobRequirementsForm';
import CandidateMatchVisualization from './components/CandidateMatchVisualization';
import RequirementSimulator from './components/RequirementSimulator';
import RecommendationPanel from './components/RecommendationPanel';
import ActionPanel from './components/ActionPanel';
import ChartVisualization from './components/ChartVisualization';
import { JobRequirement, CandidateMatch, RequirementSimulation, Recommendation } from './types';
import { calculateMatches, generateSimulations, generateRecommendationsFor80Percent } from './data/mockData';
import { Search, Bell, Settings, User, Grid3X3, ChevronDown, Cloud } from 'lucide-react';

function App() {
  const [requirements, setRequirements] = useState<JobRequirement>({
    jobType: {
      major: '営業・販売',
      middle: '営業',
      minor: ['法人営業']
    },
    hourlyWage: 1200,
    workArea: {
      prefecture: '東京都',
      city: ['新宿区', '渋谷区']
    },
    skillRequirements: ['Excel', 'Word', '営業経験'],
    workHours: {
      start: '09:00',
      end: '18:00'
    },
    workDays: ['月', '火', '水', '木', '金'],
    dependentStatus: false
  });
  
  const [matchData, setMatchData] = useState<CandidateMatch>({
    totalCount: 0,
    matchCount: 0,
    matchPercentage: 0
  });
  
  const [previousMatchData, setPreviousMatchData] = useState<CandidateMatch | undefined>(undefined);
  
  const [simulations, setSimulations] = useState<RequirementSimulation[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  // Update match data when requirements change
  useEffect(() => {
    const newMatchData = calculateMatches(requirements);
    
    setPreviousMatchData(matchData);
    setMatchData(newMatchData);
    
    // Generate simulations
    const newSimulations = generateSimulations(requirements);
    setSimulations(newSimulations);
    
    // Generate recommendations for 80% target
    const newRecommendations = generateRecommendationsFor80Percent(requirements);
    setRecommendations(newRecommendations);
  }, [requirements]);
  
  const handleRequirementsChange = (newRequirements: JobRequirement) => {
    setRequirements(newRequirements);
  };
  
  const handleApplySimulation = (simulation: RequirementSimulation) => {
    setRequirements(prev => {
      const newRequirements = { ...prev };
      
      if (simulation.parameter === 'hourlyWage') {
        newRequirements.hourlyWage = simulation.newValue;
      } else if (simulation.parameter === 'workArea.prefecture') {
        newRequirements.workArea.prefecture = simulation.newValue;
        newRequirements.workArea.city = []; // Reset cities when prefecture changes
      } else if (simulation.parameter === 'jobType.major') {
        newRequirements.jobType.major = simulation.newValue;
        newRequirements.jobType.middle = '';
        newRequirements.jobType.minor = [];
      } else if (simulation.parameter === 'skillRequirements') {
        newRequirements.skillRequirements = simulation.newValue;
      } else if (simulation.parameter === 'workDays') {
        newRequirements.workDays = simulation.newValue;
      }
      
      return newRequirements;
    });
  };
  
  const handleApplyRecommendation = (recommendation: Recommendation) => {
    setRequirements(prev => {
      const newRequirements = { ...prev };
      
      if (recommendation.parameter === 'hourlyWage') {
        newRequirements.hourlyWage = recommendation.suggestedValue;
      } else if (recommendation.parameter === 'workArea.prefecture') {
        newRequirements.workArea.prefecture = recommendation.suggestedValue;
        newRequirements.workArea.city = []; // Reset cities when prefecture changes
      } else if (recommendation.parameter === 'jobType.major') {
        newRequirements.jobType.major = recommendation.suggestedValue;
        newRequirements.jobType.middle = '';
        newRequirements.jobType.minor = [];
      } else if (recommendation.parameter === 'skillRequirements') {
        newRequirements.skillRequirements = recommendation.suggestedValue;
      } else if (recommendation.parameter === 'workDays') {
        newRequirements.workDays = recommendation.suggestedValue;
      }
      
      return newRequirements;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200">
      {/* Salesforce Lightning Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        {/* Top Header Bar */}
        <div className="px-4 py-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Cloud className="w-6 h-6 text-blue" />
                {/* <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-white" />
                  <span className="text-white font-medium text-sm">HAYABUSA Lightning</span>
                </div> */}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="検索..."
                  className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-gray-700 hover:bg-blue-700 rounded-md">
                  <Bell className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-700 hover:bg-blue-700 rounded-md">
                  <Settings className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 ml-2">
                  <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-gray-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">山下 夏輝</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="px-4 py-2 bg-white">
          <nav className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-gray-700" />
                  <span className="text-gray-700 font-medium text-sm">HAYABUSA Lightning</span>
            </div>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
              ホーム
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              Chatter
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              ジョブ検索
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              キャンディデート検索
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              クライアント
              <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              キャンディデイト/クライアント
              <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              ジョブ
              <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              マッチングパイプライン
              <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              さらに表示
              <ChevronDown className="w-3 h-3" />
            </button>
          </nav>
        </div>

        {/* Page Title Section */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">求人条件最適化ツール</h1>
              <p className="text-blue-100 text-sm mt-1">人材プール照合による最適な求人条件の提案</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              <JobRequirementsForm 
                requirements={requirements}
                onRequirementsChange={handleRequirementsChange} 
              />
              <ActionPanel requirements={requirements} matchData={matchData} />
            </div>
            
            {/* Middle Column */}
            <div className="lg:col-span-1 space-y-6">
              <CandidateMatchVisualization 
                matchData={matchData} 
                previousMatchData={previousMatchData}
              />
              <ChartVisualization 
                matchData={matchData} 
                simulations={simulations}
              />
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              <RecommendationPanel 
                recommendations={recommendations}
                onApplyRecommendation={handleApplyRecommendation}
                matchPercentage={matchData.matchPercentage}
              />
              <RequirementSimulator 
                simulations={simulations}
                currentRequirements={requirements}
                onApplySimulation={handleApplySimulation}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;