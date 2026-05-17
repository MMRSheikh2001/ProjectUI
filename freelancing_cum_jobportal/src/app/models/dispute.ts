export interface Dispute {
  id?: string | number;
  orderId?: string | number;
  raisedBy: string | number;
  reason: string;
  status: 'open' | 'under-review' | 'resolved' | 'closed';
  adminAction: string;
}




