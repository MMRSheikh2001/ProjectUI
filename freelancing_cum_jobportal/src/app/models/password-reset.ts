export interface PasswordReset {
  id?: string;
  userId: string;
  resetToken: string;
  expiresAt: string;
  used: boolean;
}


