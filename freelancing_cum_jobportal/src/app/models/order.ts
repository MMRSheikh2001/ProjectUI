export interface Order {
  id?: string | number;
  gigId?: string | number;
  clientId?: string | number;
  freelancerId?: string | number;
  totalAmount: number;
  commissionAmount: number;
  status: 'pending' | 'active' | 'delivered' | 'revision' | 'completed' | 'cancelled' | 'disputed';
  isDeleted: boolean;
  createdAt: string;
  completedAt: string;
}




