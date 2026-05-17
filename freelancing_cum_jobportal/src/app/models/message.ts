export interface Message {
  id?: string | number;
  chatId?: string | number;
  senderId?: string | number;
  message: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
}




