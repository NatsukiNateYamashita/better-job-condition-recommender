export type JobRequirement = {
  jobType: {
    major: string;
    middle: string;
    minor: string[];
  };
  hourlyWage: number;
  workArea: {
    prefecture: string;
    city: string[];
  };
  skillRequirements: string[];
  workHours: {
    start: string;
    end: string;
  };
  workDays: string[];
  dependentStatus: boolean;
};

export type CandidateMatch = {
  totalCount: number;
  matchCount: number;
  matchPercentage: number;
};

export type RequirementSimulation = {
  parameter: string;
  currentValue: any;
  newValue: any;
  matchIncrease: number;
  percentageIncrease: number;
};

export type Recommendation = {
  parameter: string;
  currentValue: any;
  suggestedValue: any;
  potentialIncrease: number;
  priority: 'high' | 'medium' | 'low';
};