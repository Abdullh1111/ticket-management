type TMessage = {
  id: number;
  sender: 'user' | 'admin';
  content: string;
  createdAt: string;
};