export type TComment = {
  id?: string;
    author: string;
    content: string;
    createdAt: string;
  }
export type TTicket = {
  id: string;
  subject: string;
  description: string;
  category: 'Technical' | 'Billing' | 'General';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  attachmentUrl?: string;
  comments: TComment[];
};