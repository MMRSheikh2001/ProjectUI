export interface JobBenefit {
  name: string;
  icon: string;
}

export interface CompanyInfo {
  website: string;
  industry: string;
  companySize: string;
  foundedYear: number;
  overview: string;
  linkedinUrl: string;
  facebookUrl: string;
  isVerified: boolean;
  officeImages: string[];
}

export interface Job {
  id?: string | number;
  employerId?: string | number;

  // ── Basic (existing) ──
  title: string;
  description: string;
  companyName: string;
  companyLogo: string;
  city: string;
  area: string;
  salaryMin: number;
  salaryMax: number;
  jobType: 'full-time' | 'part-time' | 'remote' | 'contract';
  experienceRequired: string;
  deadline: string;
  status: 'open' | 'closed' | 'paused';
  isDeleted: boolean;
  createdAt: string;

  // ── Extended Fields ──
  vacancyCount: number;
  workplaceType: 'onsite' | 'remote' | 'hybrid';
  division: string;
  district: string;
  fullAddress: string;
  industry: string;
  educationLevel: string;
  preferredUniversities: string[];
  experienceYearsMin: number;
  experienceYearsMax: number;
  preferredIndustries: string[];
  requiredSkills: string[];
  softSkills: string[];
  languageRequirements: string;
  responsibilities: string[];
  dailyTasks: string[];
  kpis: string[];
  benefits: JobBenefit[];
  salaryNegotiable: boolean;
  festivalBonus: boolean;
  mobileAllowance: boolean;
  medicalAllowance: boolean;
  lunchFacility: boolean;
  performanceBonus: boolean;
  flexibleHours: boolean;
  workFromHome: boolean;
  genderPreference: 'Any' | 'Male' | 'Female';
  isUrgent: boolean;
  isFeatured: boolean;
  tags: string[];
  viewCount: number;
  applicantsCount: number;
  companyInfo?: CompanyInfo;
  teamEnvironment: string;
  growthOpportunity: string;
  publishedDate: string;
}




