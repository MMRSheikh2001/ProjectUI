export interface Report {
  id?: string | number;
  reportedUserId?: string | number;
  reportedBy: string | number;
  reason: string;
  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed';
}




