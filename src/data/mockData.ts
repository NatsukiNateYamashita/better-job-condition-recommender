import { CandidateMatch, RequirementSimulation, JobRequirement, Recommendation } from "../types";

// Mock function to calculate matches based on job requirements
export const calculateMatches = (requirements: JobRequirement): CandidateMatch => {
  const totalCandidates = 1000;
  let matchCount = totalCandidates * 0.1; // Start with 10%
  
  // Adjust based on job type major
  const jobTypeMultipliers: Record<string, number> = {
    "IT・エンジニア": 0.7,
    "営業・販売": 1.2,
    "事務・オフィスワーク": 1.1,
    "製造・技術": 0.9,
    "サービス・接客": 1.0,
    "医療・介護": 0.8,
    "教育・保育": 0.6,
    "建設・土木": 0.7
  };
  
  matchCount *= jobTypeMultipliers[requirements.jobType.major] || 1.0;
  
  // Adjust based on job type middle
  if (requirements.jobType.middle) {
    matchCount *= 0.8; // More specific = fewer candidates
  }
  
  // Adjust based on job type minor
  if (requirements.jobType.minor.length > 0) {
    const minorPenalty = requirements.jobType.minor.length * 0.1;
    matchCount *= (1 - minorPenalty);
  }
  
  // Adjust based on wage (higher wage = more candidates)
  const wageImpact = (requirements.hourlyWage - 1000) / 100;
  matchCount *= (1 + wageImpact * 0.1);
  
  // Adjust based on work area
  const prefectureMultipliers: Record<string, number> = {
    "東京都": 1.5,
    "大阪府": 1.2,
    "愛知県": 0.9,
    "神奈川県": 1.3,
    "埼玉県": 1.1,
    "千葉県": 1.0,
    "兵庫県": 0.8,
    "福岡県": 0.7
  };
  
  matchCount *= prefectureMultipliers[requirements.workArea.prefecture] || 0.6;
  
  // Adjust based on city selection
  if (requirements.workArea.city.length > 0) {
    const cityPenalty = Math.max(0, requirements.workArea.city.length - 1) * 0.05;
    matchCount *= (1 - cityPenalty);
  }
  
  // Adjust based on work hours (stricter hours = fewer candidates)
  const startHour = parseInt(requirements.workHours.start.split(':')[0]);
  const endHour = parseInt(requirements.workHours.end.split(':')[0]);
  const workDuration = endHour - startHour;
  
  if (startHour < 8 || endHour > 19) {
    matchCount *= 0.8; // Unusual hours penalty
  }
  if (workDuration > 8) {
    matchCount *= 0.9; // Long hours penalty
  }
  
  // Adjust based on work days
  const weekendDays = requirements.workDays.filter(day => ['土', '日'].includes(day)).length;
  if (weekendDays > 0) {
    matchCount *= (1 - weekendDays * 0.1); // Weekend penalty
  }
  
  if (requirements.workDays.length < 5) {
    matchCount *= 1.1; // Part-time bonus
  }
  
  // Adjust based on skill requirements (more skills = fewer candidates)
  const skillPenalty = Math.max(0, requirements.skillRequirements.length - 2) * 0.1;
  matchCount *= (1 - skillPenalty);
  
  // Adjust based on dependent status
  if (requirements.dependentStatus) {
    matchCount *= 0.7; // Fewer candidates want dependent status
  }
  
  // Ensure matchCount is within reasonable bounds
  matchCount = Math.min(Math.round(Math.max(matchCount, 0)), totalCandidates);
  
  // Calculate match percentage: 444+ candidates = 100%, 0 candidates = 0%
  const matchPercentage = matchCount >= 444 ? 100 : (matchCount / 444) * 100;
  
  return {
    totalCount: totalCandidates,
    matchCount,
    matchPercentage
  };
};

// Mock function to generate simulations for different parameter changes
export const generateSimulations = (requirements: JobRequirement): RequirementSimulation[] => {
  const baseMatch = calculateMatches(requirements);
  const simulations: RequirementSimulation[] = [];
  
  // Hourly wage simulation
  const wageSimulation: RequirementSimulation = {
    parameter: "hourlyWage",
    currentValue: requirements.hourlyWage,
    newValue: requirements.hourlyWage + 100,
    matchIncrease: 0,
    percentageIncrease: 0
  };
  
  const newWageRequirements = { ...requirements, hourlyWage: requirements.hourlyWage + 100 };
  const newWageMatch = calculateMatches(newWageRequirements);
  wageSimulation.matchIncrease = newWageMatch.matchCount - baseMatch.matchCount;
  wageSimulation.percentageIncrease = baseMatch.matchCount > 0 
    ? ((newWageMatch.matchCount / baseMatch.matchCount) - 1) * 100 
    : 0;
  
  if (wageSimulation.percentageIncrease > 0) {
    simulations.push(wageSimulation);
  }
  
  // Prefecture simulation
  const currentPrefecture = requirements.workArea.prefecture;
  const alternativePrefecture = currentPrefecture === "東京都" ? "大阪府" : "東京都";
  
  const prefectureSimulation: RequirementSimulation = {
    parameter: "workArea.prefecture",
    currentValue: currentPrefecture,
    newValue: alternativePrefecture,
    matchIncrease: 0,
    percentageIncrease: 0
  };
  
  const newPrefectureRequirements = {
    ...requirements,
    workArea: { ...requirements.workArea, prefecture: alternativePrefecture, city: [] }
  };
  const newPrefectureMatch = calculateMatches(newPrefectureRequirements);
  prefectureSimulation.matchIncrease = newPrefectureMatch.matchCount - baseMatch.matchCount;
  prefectureSimulation.percentageIncrease = baseMatch.matchCount > 0 
    ? ((newPrefectureMatch.matchCount / baseMatch.matchCount) - 1) * 100 
    : 0;
  
  if (prefectureSimulation.percentageIncrease > 0) {
    simulations.push(prefectureSimulation);
  }
  
  // Job type major simulation
  const currentJobType = requirements.jobType.major;
  const alternativeJobType = currentJobType === "営業・販売" ? "事務・オフィスワーク" : "営業・販売";
  
  const jobTypeSimulation: RequirementSimulation = {
    parameter: "jobType.major",
    currentValue: currentJobType,
    newValue: alternativeJobType,
    matchIncrease: 0,
    percentageIncrease: 0
  };
  
  const newJobTypeRequirements = {
    ...requirements,
    jobType: { major: alternativeJobType, middle: '', minor: [] }
  };
  const newJobTypeMatch = calculateMatches(newJobTypeRequirements);
  jobTypeSimulation.matchIncrease = newJobTypeMatch.matchCount - baseMatch.matchCount;
  jobTypeSimulation.percentageIncrease = baseMatch.matchCount > 0 
    ? ((newJobTypeMatch.matchCount / baseMatch.matchCount) - 1) * 100 
    : 0;
  
  if (jobTypeSimulation.percentageIncrease > 0) {
    simulations.push(jobTypeSimulation);
  }
  
  // Skill requirements simulation (reduce by one skill)
  if (requirements.skillRequirements.length > 1) {
    const skillSimulation: RequirementSimulation = {
      parameter: "skillRequirements",
      currentValue: requirements.skillRequirements,
      newValue: requirements.skillRequirements.slice(0, -1),
      matchIncrease: 0,
      percentageIncrease: 0
    };
    
    const newSkillRequirements = {
      ...requirements,
      skillRequirements: requirements.skillRequirements.slice(0, -1)
    };
    const newSkillMatch = calculateMatches(newSkillRequirements);
    skillSimulation.matchIncrease = newSkillMatch.matchCount - baseMatch.matchCount;
    skillSimulation.percentageIncrease = baseMatch.matchCount > 0 
      ? ((newSkillMatch.matchCount / baseMatch.matchCount) - 1) * 100 
      : 0;
    
    if (skillSimulation.percentageIncrease > 0) {
      simulations.push(skillSimulation);
    }
  }
  
  // Work days simulation (reduce weekend requirements)
  const weekendDays = requirements.workDays.filter(day => ['土', '日'].includes(day));
  if (weekendDays.length > 0) {
    const workDaysSimulation: RequirementSimulation = {
      parameter: "workDays",
      currentValue: requirements.workDays,
      newValue: requirements.workDays.filter(day => !['土', '日'].includes(day)),
      matchIncrease: 0,
      percentageIncrease: 0
    };
    
    const newWorkDaysRequirements = {
      ...requirements,
      workDays: requirements.workDays.filter(day => !['土', '日'].includes(day))
    };
    const newWorkDaysMatch = calculateMatches(newWorkDaysRequirements);
    workDaysSimulation.matchIncrease = newWorkDaysMatch.matchCount - baseMatch.matchCount;
    workDaysSimulation.percentageIncrease = baseMatch.matchCount > 0 
      ? ((newWorkDaysMatch.matchCount / baseMatch.matchCount) - 1) * 100 
      : 0;
    
    if (workDaysSimulation.percentageIncrease > 0) {
      simulations.push(workDaysSimulation);
    }
  }
  
  return simulations;
};

// Generate recommendations to achieve 80% match rate
export const generateRecommendationsFor80Percent = (requirements: JobRequirement): Recommendation[] => {
  const baseMatch = calculateMatches(requirements);
  const recommendations: Recommendation[] = [];
  
  if (baseMatch.matchPercentage >= 80) {
    return recommendations; // Already at target
  }
  
  // Try different adjustments to reach 80%
  const targetCount = Math.ceil(444 * 0.8); // 80% of 444 (which gives 100% match rate)
  
  // Wage increase recommendation
  for (let wageIncrease = 100; wageIncrease <= 500; wageIncrease += 100) {
    const testRequirements = { ...requirements, hourlyWage: requirements.hourlyWage + wageIncrease };
    const testMatch = calculateMatches(testRequirements);
    
    if (testMatch.matchPercentage >= 80) {
      recommendations.push({
        parameter: "hourlyWage",
        currentValue: requirements.hourlyWage,
        suggestedValue: requirements.hourlyWage + wageIncrease,
        potentialIncrease: ((testMatch.matchCount / baseMatch.matchCount) - 1) * 100,
        priority: wageIncrease <= 200 ? 'high' : 'medium'
      });
      break;
    }
  }
  
  // Prefecture change recommendation
  const bestPrefectures = ["東京都", "大阪府", "神奈川県"];
  for (const prefecture of bestPrefectures) {
    if (prefecture !== requirements.workArea.prefecture) {
      const testRequirements = {
        ...requirements,
        workArea: { ...requirements.workArea, prefecture, city: [] }
      };
      const testMatch = calculateMatches(testRequirements);
      
      if (testMatch.matchPercentage >= 80) {
        recommendations.push({
          parameter: "workArea.prefecture",
          currentValue: requirements.workArea.prefecture,
          suggestedValue: prefecture,
          potentialIncrease: ((testMatch.matchCount / baseMatch.matchCount) - 1) * 100,
          priority: 'high'
        });
        break;
      }
    }
  }
  
  // Job type change recommendation
  const bestJobTypes = ["営業・販売", "事務・オフィスワーク"];
  for (const jobType of bestJobTypes) {
    if (jobType !== requirements.jobType.major) {
      const testRequirements = {
        ...requirements,
        jobType: { major: jobType, middle: '', minor: [] }
      };
      const testMatch = calculateMatches(testRequirements);
      
      if (testMatch.matchPercentage >= 80) {
        recommendations.push({
          parameter: "jobType.major",
          currentValue: requirements.jobType.major,
          suggestedValue: jobType,
          potentialIncrease: ((testMatch.matchCount / baseMatch.matchCount) - 1) * 100,
          priority: 'medium'
        });
        break;
      }
    }
  }
  
  // Skill reduction recommendation
  if (requirements.skillRequirements.length > 2) {
    const testRequirements = {
      ...requirements,
      skillRequirements: requirements.skillRequirements.slice(0, 2)
    };
    const testMatch = calculateMatches(testRequirements);
    
    if (testMatch.matchPercentage >= 80) {
      recommendations.push({
        parameter: "skillRequirements",
        currentValue: requirements.skillRequirements,
        suggestedValue: requirements.skillRequirements.slice(0, 2),
        potentialIncrease: ((testMatch.matchCount / baseMatch.matchCount) - 1) * 100,
        priority: 'medium'
      });
    }
  }
  
  // Work days recommendation (remove weekends)
  const weekendDays = requirements.workDays.filter(day => ['土', '日'].includes(day));
  if (weekendDays.length > 0) {
    const testRequirements = {
      ...requirements,
      workDays: requirements.workDays.filter(day => !['土', '日'].includes(day))
    };
    const testMatch = calculateMatches(testRequirements);
    
    if (testMatch.matchPercentage >= 80) {
      recommendations.push({
        parameter: "workDays",
        currentValue: requirements.workDays,
        suggestedValue: requirements.workDays.filter(day => !['土', '日'].includes(day)),
        potentialIncrease: ((testMatch.matchCount / baseMatch.matchCount) - 1) * 100,
        priority: 'medium'
      });
    }
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

// Job type hierarchical data
export const jobTypeHierarchy = {
  "IT・エンジニア": {
    "システムエンジニア": ["Webエンジニア", "インフラエンジニア", "アプリエンジニア"],
    "プログラマー": ["Java", "Python", "JavaScript", "PHP"],
    "デザイナー": ["Webデザイナー", "UIデザイナー", "グラフィックデザイナー"]
  },
  "営業・販売": {
    "営業": ["法人営業", "個人営業", "内勤営業", "外勤営業"],
    "販売": ["店舗販売", "接客", "レジ", "商品管理"],
    "企画・マーケティング": ["商品企画", "広告企画", "市場調査"]
  },
  "事務・オフィスワーク": {
    "一般事務": ["データ入力", "書類作成", "電話対応", "来客対応"],
    "経理・財務": ["経理", "財務", "会計", "給与計算"],
    "人事・総務": ["人事", "総務", "労務", "採用"]
  },
  "製造・技術": {
    "製造": ["組立", "検査", "梱包", "機械操作"],
    "技術": ["設計", "開発", "品質管理", "保守"],
    "物流": ["倉庫", "配送", "仕分け", "ピッキング"]
  },
  "サービス・接客": {
    "飲食": ["ホール", "キッチン", "バリスタ", "調理補助"],
    "小売": ["レジ", "品出し", "接客", "清掃"],
    "宿泊": ["フロント", "客室清掃", "ベルスタッフ"]
  },
  "医療・介護": {
    "医療": ["看護師", "医療事務", "薬剤師", "検査技師"],
    "介護": ["介護士", "ヘルパー", "ケアマネージャー", "生活相談員"],
    "福祉": ["保育士", "社会福祉士", "精神保健福祉士"]
  },
  "教育・保育": {
    "教育": ["講師", "塾講師", "家庭教師", "学習支援"],
    "保育": ["保育士", "幼稚園教諭", "学童指導員", "ベビーシッター"]
  },
  "建設・土木": {
    "建設": ["大工", "左官", "塗装", "電気工事"],
    "土木": ["土木作業", "重機操作", "測量", "現場監督"]
  }
};

// Prefecture and city data
export const locationHierarchy = {
  "東京都": ["千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区", "品川区", "目黒区", "大田区", "世田谷区", "渋谷区", "中野区", "杉並区", "豊島区", "北区", "荒川区", "板橋区", "練馬区", "足立区", "葛飾区", "江戸川区"],
  "大阪府": ["大阪市北区", "大阪市中央区", "大阪市西区", "大阪市天王寺区", "大阪市浪速区", "大阪市東淀川区", "堺市", "豊中市", "吹田市", "高槻市", "枚方市", "茨木市", "八尾市", "寝屋川市"],
  "愛知県": ["名古屋市中区", "名古屋市東区", "名古屋市北区", "名古屋市西区", "名古屋市中村区", "名古屋市中川区", "名古屋市港区", "豊田市", "岡崎市", "一宮市", "瀬戸市", "半田市"],
  "神奈川県": ["横浜市西区", "横浜市中区", "横浜市南区", "横浜市港北区", "川崎市川崎区", "川崎市幸区", "相模原市", "藤沢市", "茅ヶ崎市", "厚木市", "大和市"],
  "埼玉県": ["さいたま市大宮区", "さいたま市浦和区", "さいたま市中央区", "川口市", "所沢市", "越谷市", "草加市", "春日部市", "熊谷市", "川越市"],
  "千葉県": ["千葉市中央区", "千葉市花見川区", "千葉市稲毛区", "船橋市", "松戸市", "市川市", "柏市", "市原市", "八千代市", "流山市"],
  "兵庫県": ["神戸市中央区", "神戸市東灘区", "神戸市灘区", "姫路市", "尼崎市", "明石市", "西宮市", "芦屋市", "伊丹市", "加古川市"],
  "福岡県": ["福岡市博多区", "福岡市中央区", "福岡市南区", "北九州市小倉北区", "北九州市八幡西区", "久留米市", "飯塚市", "大牟田市", "春日市"]
};

// List of skills for selection
export const skills = [
  "HTML/CSS",
  "JavaScript",
  "React",
  "Vue.js",
  "Angular",
  "Java",
  "Python",
  "PHP",
  "C#",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Git",
  "Photoshop",
  "Illustrator",
  "Figma",
  "Sketch",
  "UI/UX",
  "Excel",
  "Word",
  "PowerPoint",
  "Access",
  "VBA",
  "英語",
  "中国語",
  "韓国語",
  "TOEIC",
  "営業経験",
  "接客経験",
  "リーダー経験",
  "マネジメント経験",
  "プロジェクト管理",
  "簿記",
  "会計",
  "税務",
  "人事労務",
  "法務",
  "マーケティング",
  "広告運用",
  "SEO",
  "SNS運用",
  "コンテンツ制作",
  "動画編集",
  "写真撮影"
];