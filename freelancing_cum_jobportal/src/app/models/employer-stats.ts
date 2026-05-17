export interface EmployerStats {
    id?: string;
    userId: string;
    companyName: string;
    companyLogo: string;
    coverImage: string;
    isVerified: boolean;
    industry: string;
    companySize: string;
    founded: string;
    website: string;
    overview: string;
    culture: string;
    officeImages: string[];
    benefits: string[];
    socialLinks: {
        linkedin: string;
        facebook: string;
        twitter: string;
    };
    activeJobs: number;
    totalHires: number;
    employeeCount: number;
    hiringFunnel: {
        applied: number;
        reviewed: number;
        shortlisted: number;
        interviewed: number;
        hired: number;
    };
    totalJobsPosted?: number;
    memberSince?: string;
    avgResponseTime?: string;
}


