// ── Sub-interfaces ────────────────────────────────────────────

export interface Education {
  id?: string | number;
  degree: string;
  groupMajor: string;
  institute: string;
  board: string;
  result: string;
  passingYear: number;
  duration: string;
  achievements: string;
}

export interface Experience {
  id?: string | number;
  companyName: string;
  designation: string;
  department: string;
  employmentPeriod: string;
  currentlyWorking: boolean;
  responsibilities: string;
  achievements: string;
}

export interface SkillEntry {
  id?: string | number;
  skillName: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
}

export interface Certification {
  id?: string | number;
  courseName: string;
  institute: string;
  completionYear: number;
  credentialId: string;
}

export interface Training {
  id?: string | number;
  title: string;
  institute: string;
  duration: string;
  year: number;
}

export interface Project {
  id?: string | number;
  projectName: string;
  technologies: string;
  description: string;
  githubLink: string;
  liveLink: string;
}

// ── Main Resume Interface ─────────────────────────────────────

export interface Resume {
  id?: string | number;
  userId?: string | number;

  // ── Basic (existing fields — kept) ──
  summary: string;
  education: string;
  experience: string;
  certifications: string;
  githubLink: string;
  portfolioLink: string;

  // ── Personal Info ──
  fatherName: string;
  motherName: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  dateOfBirth: string;
  nationality: string;
  religion: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed' | '';
  bloodGroup: string;

  // ── Contact & Address ──
  division: string;
  district: string;
  upazila: string;
  postCode: string;
  presentAddress: string;
  permanentAddress: string;

  // ── Career Info ──
  careerObjective: string;
  careerSummary: string;
  resumeHeadline: string;
  presentSalary: number;
  expectedSalary: number;
  availableFor: 'Full-time' | 'Part-time' | 'Remote' | 'Freelance' | 'Internship' | '';
  preferredJobCategories: string[];
  preferredLocations: string[];
  careerLevel: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Top Level' | '';

  // ── Social & Portfolio ──
  linkedinUrl: string;
  behanceUrl: string;
  dribbbleUrl: string;

  // ── Language ──
  languagesKnown: string[];
  englishProficiency: 'Basic' | 'Conversational' | 'Proficient' | 'Fluent' | 'Native' | '';

  // ── Verification ──
  nidNumber: string;
  nidVerified: boolean;

  // ── CV Meta ──
  profileCompletion: number;
  cvVisibility: 'Public' | 'Private' | 'Recruiters Only';

  // ── Dynamic Arrays ──
  educations: Education[];
  experiences: Experience[];
  skillEntries: SkillEntry[];
  certificationList: Certification[];
  trainings: Training[];
  projects: Project[];
}




