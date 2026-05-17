export interface UserVerification {
  id?: string | number;
  userId?: string | number;
  otpCode: string;
  type: 'email' | 'phone';
  expiresAt: string;
  isVerified: boolean;
}




