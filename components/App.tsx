'use client';

import React, { useState, useEffect } from 'react';
import { JobRequirement, CandidateMatch, RequirementSimulation, Recommendation } from '@/types';
import { calculateMatches, generateSimulations, generateRecommendationsFor80Percent } from '@/data/mockData';
import JobRequirementsForm from './JobRequirementsForm';
import CandidateMatchVisualization from './CandidateMatchVisualization';
import RequirementSimulator from './RequirementSimulator';
import RecommendationPanel from './RecommendationPanel';
import ActionPanel from './ActionPanel';
import ChartVisualization from './ChartVisualization';

export default function App() {
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
    console.log('App: useEffect triggered with requirements:', requirements);
    const newMatchData = calculateMatches(requirements);

    setPreviousMatchData(matchData);
    setMatchData(newMatchData);

    // Generate simulations
    console.log('App: Generated match data:', newMatchData);
    const newSimulations = generateSimulations(requirements);
    setSimulations(newSimulations);

    // Generate recommendations for 80% target
    console.log('App: Generated simulations:', newSimulations);
    const newRecommendations = generateRecommendationsFor80Percent(requirements);
    console.log('App: Generated recommendations:', newRecommendations);
    setRecommendations(newRecommendations);
  }, [requirements]);
  
  const handleRequirementsChange = (newRequirements: JobRequirement) => {
    console.log('App: Handling requirements change:', {
      old: requirements,
      new: newRequirements,
      source: 'form'
    });

    // Validate hourly wage is within bounds
    const validWage = Math.max(900, Math.min(3000, newRequirements.hourlyWage));

    // Update requirements with validated hourly wage and other changes
    setRequirements(prev => {
      const updatedRequirements = {
        ...prev,
        ...newRequirements,
        hourlyWage: validWage
      };
      console.log('App: Updated requirements:', updatedRequirements);
      return updatedRequirements;
    });
  };
  
  const handleApplySimulation = (simulation: RequirementSimulation) => {
    console.log('App: Starting handleApplySimulation:', {
      parameter: simulation.parameter,
      currentValue: simulation.currentValue,
      newValue: simulation.newValue,
      source: 'simulation'
    });

    setRequirements(prev => {
      // Return early if no change
      if (simulation.parameter === 'hourlyWage' && 
          Number(simulation.newValue) === prev.hourlyWage) {
        return prev;
      }

      let newRequirements: JobRequirement;

      // Create new requirements object and handle specific parameter updates
      switch (simulation.parameter) {
        case 'hourlyWage':
          const newWage = Number(simulation.newValue);
          console.log('App: Updating hourlyWage:', {
            old: prev.hourlyWage,
            new: newWage,
            source: 'simulation'
          });
          newRequirements = {
            ...prev,
            hourlyWage: Math.max(900, Math.min(3000, newWage))
          };
          break;
          
        case 'workArea.prefecture':
          newRequirements = {
            ...prev,
            workArea: {
              prefecture: String(simulation.newValue),
              city: []
            }
          };
          break;
          
        case 'jobType.major':
          newRequirements = {
            ...prev,
            jobType: {
              major: String(simulation.newValue),
              middle: '',
              minor: []
            }
          };
          break;
          
        case 'skillRequirements':
          newRequirements = {
            ...prev,
            skillRequirements: Array.isArray(simulation.newValue) ? 
              simulation.newValue : [simulation.newValue]
          };
          break;
          
        case 'workDays':
          newRequirements = {
            ...prev,
            workDays: Array.isArray(simulation.newValue) ? 
              simulation.newValue : [simulation.newValue]
          };
          break;
          
        default:
          newRequirements = { ...prev };
      }
      
      console.log('App: Updated requirements:', newRequirements);
      return newRequirements;
    });
  };
  
  const handleApplyRecommendation = (recommendation: Recommendation) => {
    console.log('App: Applying recommendation:', {
      type: recommendation.changes ? 'multiple' : 'single',
      recommendation: JSON.stringify(recommendation)
    });
    
    setRequirements(prev => {
      const newRequirements = { ...prev };
      console.log('App: Current requirements:', JSON.stringify(prev));
      
      const applyChange = (param: string, value: any) => {
        console.log('App: Applying change:', {
          parameter: param,
          value: JSON.stringify(value),
          valueType: typeof value
        });
        
        switch (param) {
          case 'hourlyWage':
            newRequirements.hourlyWage = Number(value);
            console.log('App: Updated hourlyWage:', newRequirements.hourlyWage);
            break;
          case 'workArea.prefecture':
            newRequirements.workArea = {
              prefecture: String(value),
              city: []
            };
            console.log('App: Updated workArea:', newRequirements.workArea);
            break;
          case 'jobType.major':
            newRequirements.jobType = {
              major: String(value),
              middle: '',
              minor: []
            };
            console.log('App: Updated jobType:', newRequirements.jobType);
            break;
          case 'skillRequirements':
            newRequirements.skillRequirements = Array.isArray(value) ? [...value] : [value];
            console.log('App: Updated skillRequirements:', newRequirements.skillRequirements);
            break;
          case 'workDays':
            newRequirements.workDays = Array.isArray(value) ? [...value] : [value];
            console.log('App: Updated workDays:', newRequirements.workDays);
            break;
          default:
            console.warn('App: Unhandled parameter type:', param);
        }
      };

      if (recommendation.changes) {
        console.log('App: Applying multiple changes:', recommendation.changes.length);
        recommendation.changes.forEach(change => {
          applyChange(change.parameter, change.suggestedValue);
        });
      } else {
        console.log('App: Applying single change');
        applyChange(recommendation.parameter, recommendation.suggestedValue);
      }
      
      console.log('App: Final requirements:', JSON.stringify(newRequirements));
      return newRequirements;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 via-sky-100 to-sky100">
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
              {/* <RequirementCombinationPanel
                recommendations={recommendations}
                onApplyCombination={handleApplyRecommendation}
                matchPercentage={matchData.matchPercentage}
              /> */}
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