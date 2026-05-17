export interface JobseekerDashboardStats {
    id?: string | number;
    userId?: string | number;

    profileCompletion: number;
    resumeScore: number;
    appliedJobs: number;
    savedJobs: number;
    profileViews: number;
    interviewInvitations: number;
    shortlisted: number;
    rejected: number;

    applicationsByStatus?: { status: string; count: number }[];
    recentlyViewedJobs?: string[];

    recommendedJobsCount: number;
}

export interface FreelancerDashboardStats {
    id?: string;
    userId?: string;

    totalEarnings: number;
    monthlyEarnings: number;
    pendingEarnings: number;

    ordersCompleted: number;
    ordersActive: number;

    gigViews: number;
    conversionRate: number;

    avgResponseTime?: string;

    weeklyRevenue?: number[];

    topGigTitle: string;
    topGigOrders: number;

    clientsServed: number;
    repeatClients: number;
}

export interface EmployerDashboardStats {
    id?: string;
    userId?: string;

    activeJobs: number;
    activeJobsCount?: number;
    postedJobsCount?: number;
    totalApplicants: number;
    shortlisted: number;
    shortlistedCount?: number;
    hired: number;
    hiredCount?: number;
    interviewsScheduled: number;
    jobViews: number;

    hiringFunnel?: { stage: string; count: number; color: string }[];

    topJobTitle: string;
    topJobApplicants: number;

    monthlyHires?: number[];

    totalSpent?: number;
    orderedGigsCount?: number;
}




