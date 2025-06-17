'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, MapPin, Briefcase, Pen as Yen, Users } from 'lucide-react';
import { JobRequirement } from '../types';
import { jobTypeHierarchy, locationHierarchy, skills } from '../data/mockData';

interface JobRequirementsFormProps {
  requirements: JobRequirement;
  onRequirementsChange: (requirements: JobRequirement) => void;
}

const JobRequirementsForm: React.FC<JobRequirementsFormProps> = ({ 
  requirements,
  onRequirementsChange 
}) => {
  // Initialize local state with props
  const [localRequirements, setLocalRequirements] = useState<JobRequirement>(requirements);

  // Props更新時の同期処理を改善
  useEffect(() => {
    console.log('JobRequirementsForm: Props changed:', {
      propsWage: requirements.hourlyWage,
      localWage: localRequirements.hourlyWage,
      shouldUpdate: requirements.hourlyWage !== localRequirements.hourlyWage
    });

    // propsが変更された場合、ローカル状態を更新
    if (JSON.stringify(requirements) !== JSON.stringify(localRequirements)) {
      setLocalRequirements(requirements);
    }
  }, [requirements]);

  const handleHourlyWageChange = (wage: number) => {
    // バリデーションと重複更新の防止
    const validWage = Math.max(900, Math.min(3000, wage));
    if (validWage === localRequirements.hourlyWage) return;

    console.log('JobRequirementsForm: Wage change initiated:', {
      old: localRequirements.hourlyWage,
      new: validWage
    });

    // 新しい要件オブジェクトを作成
    const newRequirements = {
      ...localRequirements,
      hourlyWage: validWage
    };

    // ローカル状態を更新
    setLocalRequirements(newRequirements);
    
    // 親コンポーネントに即座に通知
    onRequirementsChange(newRequirements);
  };

  const updateRequirements = (updates: Partial<JobRequirement>) => {
    const newRequirements = {
      ...localRequirements,
      ...updates
    };
    
    setLocalRequirements(newRequirements);
    onRequirementsChange(newRequirements);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'hourlyWage') {
      handleHourlyWageChange(parseInt(value));
    } else if (name === 'dependentStatus') {
      updateRequirements({ dependentStatus: checked });
    } else if (name === 'jobTypeMajor') {
      updateRequirements({
        jobType: {
          major: value,
          middle: '',
          minor: []
        }
      });
    } else if (name === 'jobTypeMiddle') {
      updateRequirements({
        jobType: {
          ...localRequirements.jobType,
          middle: value,
          minor: []
        }
      });
    } else if (name === 'prefecture') {
      updateRequirements({
        workArea: {
          prefecture: value,
          city: []
        }
      });
    }
  };

  const handleWorkHoursChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    updateRequirements({
      workHours: {
        ...localRequirements.workHours,
        [name === 'startTime' ? 'start' : 'end']: value
      }
    });
  };

  const handleWorkDayToggle = (day: string) => {
    const updatedWorkDays = localRequirements.workDays.includes(day)
      ? localRequirements.workDays.filter(d => d !== day)
      : [...localRequirements.workDays, day];
    
    updateRequirements({ workDays: updatedWorkDays });
  };

  const handleSkillToggle = (skill: string) => {
    const updatedSkills = localRequirements.skillRequirements.includes(skill)
      ? localRequirements.skillRequirements.filter(s => s !== skill)
      : [...localRequirements.skillRequirements, skill];
    
    updateRequirements({ skillRequirements: updatedSkills });
  };

  const handleJobTypeMinorToggle = (minor: string) => {
    const updatedMinor = localRequirements.jobType.minor.includes(minor)
      ? localRequirements.jobType.minor.filter(m => m !== minor)
      : [...localRequirements.jobType.minor, minor];
    
    updateRequirements({
      jobType: {
        ...localRequirements.jobType,
        minor: updatedMinor
      }
    });
  };

  const handleCityToggle = (city: string) => {
    const updatedCities = localRequirements.workArea.city.includes(city)
      ? localRequirements.workArea.city.filter(c => c !== city)
      : [...localRequirements.workArea.city, city];
    
    updateRequirements({
      workArea: {
        ...localRequirements.workArea,
        city: updatedCities
      }
    });
  };

  // 状態変更の監視用
  React.useEffect(() => {
    console.log('JobRequirementsForm: State updated:', {
      timestamp: new Date().toISOString(),
      localWage: localRequirements.hourlyWage,
      propsWage: requirements.hourlyWage,
      isSync: localRequirements.hourlyWage === requirements.hourlyWage
    });
  }, [localRequirements.hourlyWage, requirements.hourlyWage]);

  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];
  const jobTypeMajors = Object.keys(jobTypeHierarchy);
  const jobTypeMiddles = localRequirements.jobType.major ? Object.keys(jobTypeHierarchy[localRequirements.jobType.major as keyof typeof jobTypeHierarchy] || {}) : [];
  const jobTypeMinors = localRequirements.jobType.middle ? (jobTypeHierarchy[localRequirements.jobType.major as keyof typeof jobTypeHierarchy] as any)?.[localRequirements.jobType.middle] || [] : [];
  const prefectures = Object.keys(locationHierarchy);
  const cities = localRequirements.workArea.prefecture ? locationHierarchy[localRequirements.workArea.prefecture as keyof typeof locationHierarchy] || [] : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">求人条件入力</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Job Type */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4 text-blue-600" />
            職種
          </label>
          
          {/* Job Type Major */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">職種大</label>
            <select
              name="jobTypeMajor"
              value={localRequirements.jobType.major}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">選択してください</option>
              {jobTypeMajors.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Job Type Middle */}
          {localRequirements.jobType.major && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">職種中</label>
              <select
                name="jobTypeMiddle"
                value={localRequirements.jobType.middle}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">選択してください</option>
                {jobTypeMiddles.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          {/* Job Type Minor */}
          {localRequirements.jobType.middle && jobTypeMinors.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">職種小（複数選択可）</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-md">
                {jobTypeMinors.map((minor: string) => (
                  <button
                    key={minor}
                    type="button"
                    onClick={() => handleJobTypeMinorToggle(minor)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      localRequirements.jobType.minor.includes(minor)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {minor}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hourly Wage */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Yen className="w-4 h-4 text-blue-600" />
            時給（円）
          </label>
          <div className="flex items-center">
            <input
              type="range"
              name="hourlyWage"
              min="900"
              max="3000"
              step="50"
              value={localRequirements.hourlyWage}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                handleHourlyWageChange(newValue);
              }}
              className="w-full mr-4 accent-blue-600"
            />
            <div className="w-20 text-right font-medium text-sm">
              {localRequirements.hourlyWage.toLocaleString()}円
            </div>
          </div>
        </div>

        {/* Work Area */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 text-blue-600" />
            勤務地
          </label>
          
          {/* Prefecture */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">都道府県</label>
            <select
              name="prefecture"
              value={localRequirements.workArea.prefecture}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">選択してください</option>
              {prefectures.map(prefecture => (
                <option key={prefecture} value={prefecture}>{prefecture}</option>
              ))}
            </select>
          </div>

          {/* Cities */}
          {localRequirements.workArea.prefecture && cities.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">市区町村（複数選択可）</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-md">
                {cities.map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCityToggle(city)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      localRequirements.workArea.city.includes(city)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Work Hours */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            勤務時間
          </label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              name="startTime"
              value={localRequirements.workHours.start}
              onChange={handleWorkHoursChange}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500 text-sm">〜</span>
            <input
              type="time"
              name="endTime"
              value={localRequirements.workHours.end}
              onChange={handleWorkHoursChange}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Work Days */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            勤務曜日（複数選択可）
          </label>
          <div className="flex flex-wrap gap-2">
            {weekdays.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => handleWorkDayToggle(day)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  localRequirements.workDays.includes(day)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Requirements */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            スキル要件（複数選択可）
          </label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
            {skills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  localRequirements.skillRequirements.includes(skill)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Dependent Status */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 text-blue-600" />
            <input
              type="checkbox"
              name="dependentStatus"
              checked={localRequirements.dependentStatus}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            被扶養希望
          </label>
        </div>
      </div>
    </div>
  );
};

// Define Calendar component
function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

export default JobRequirementsForm;