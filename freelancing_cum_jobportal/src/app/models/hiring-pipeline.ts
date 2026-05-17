export interface HiringPipeline {
  id?: string | number;
  jobId?: string | number;
  applicantId?: string | number;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  updatedAt: string;
}




