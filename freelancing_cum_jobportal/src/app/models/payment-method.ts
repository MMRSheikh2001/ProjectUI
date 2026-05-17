export interface PaymentMethod {
  id?: string | number;
  userId?: string | number;
  type: 'card' | 'bank' | 'mobile';
  maskedDetails: string;
}




