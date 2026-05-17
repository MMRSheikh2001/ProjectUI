export interface InterviewRound {
  id?: string | number;
  jobId?: string | number;
  applicantId?: string | number;
  roundNo: number;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback: string;
  scheduledAt: string;
}




