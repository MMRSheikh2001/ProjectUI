export interface AppNotification {
  id?: string;
  userId: string;
  message: string;
  type: 'job_alert' | 'order_update' | 'message' | 'dispute' | 'payment' | 'system';
  referenceId: string;
  relatedType: string;
  isRead: boolean;
}


