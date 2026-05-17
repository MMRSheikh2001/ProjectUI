export interface UserSession {
  id?: string | number;
  userId?: string | number;
  jwtToken: string;
  deviceInfo: string;
  ipAddress: string;
  expiresAt: string;
}




