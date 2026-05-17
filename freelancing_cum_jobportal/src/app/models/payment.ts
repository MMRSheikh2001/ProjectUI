export interface Payment {
  id?: string;
  userId: string;
  orderId: string;
  amount: number;
  method: 'card' | 'bank' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}


