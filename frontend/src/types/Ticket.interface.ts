
export type TTicket = {
  id: number;
  subject: string;
  description: string;
  category: 'Technical' | 'Billing' | 'General';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  attachmentUrl?: string;
  comments: {
    id: number;
    author: string;
    content: string;
    created_at: string;
  }[];
};