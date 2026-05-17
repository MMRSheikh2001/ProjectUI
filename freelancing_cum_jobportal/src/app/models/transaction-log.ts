export interface TransactionLog {
  id?: string;
  userId: string;
  action: string;
  amount: number;
  ipAddress: string;
  deviceInfo: string;
}


