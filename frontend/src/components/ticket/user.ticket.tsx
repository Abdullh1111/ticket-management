'use client';

import { TTicket } from '@/types/Ticket.interface';
import Link from 'next/link';
import { cn } from '@/lib/utils'; // optional: utility for conditional classNames
import { usePathname } from 'next/navigation';

type Props = {
  ticket: TTicket;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'text-red-600 bg-red-100';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'Low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'text-blue-600 bg-blue-100';
    case 'InProgress':
      return 'text-orange-600 bg-orange-100';
    case 'Resolved':
      return 'text-green-600 bg-green-100';
    case 'Closed':
      return 'text-gray-600 bg-gray-200';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const TicketCard: React.FC<Props> = ({ ticket }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  return (
    <Link className='' href={ isAdmin ? `/admin/tickets/${ticket.id}` : `/dashboard/tickets/${ticket.id}`}>
      <div className="border rounded-xl p-5 shadow-md hover:shadow-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 space-y-2">
        <h2 className="text-lg font-bold text-gray-800">{ticket.subject}</h2>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Category:</span> {ticket.category}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Priority:</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-semibold',
              getPriorityColor(ticket.priority)
            )}
          >
            {ticket.priority}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Status:</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-semibold',
              getStatusColor(ticket.status)
            )}
          >
            {ticket.status}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;
