export interface Withdrawal {
  id?: string | number;
  userId?: string | number;
  amount: number;
  method: 'bank' | 'mobile';
  status: 'pending' | 'approved' | 'rejected';
}




