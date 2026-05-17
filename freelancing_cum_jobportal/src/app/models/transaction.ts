export interface Transaction {
  id?: string | number;
  userId?: string | number;
  orderId?: string | number;
  amount: number;
  type: 'credit' | 'debit';
  platformFee: number;
  freelancerAmount: number;
  previousHash: string;
  currentHash?: string;
  createdAt: string;
}




