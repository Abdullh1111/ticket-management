export type TMessage = {
  id?: string;
  sender: 'USER' | 'ADMIN';
  content: string;
  createdAt?: string;
  receiverId?: string;
  senderId?: string;
};