export interface JobApplication {
  id?: string | number;
  jobId?: string | number;
  applicantId?: string | number;
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
  job?: any;
  user?: any;
}




