'use client';

import { TComment, TTicket } from '@/types/Ticket.interface';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { usePathname } from 'next/navigation';
import { useSentCommentsMutation } from '@/redux/services/ticket.service';

type Props = {
  ticket: TTicket;
  isAdmin?: boolean;
};

const TicketShow: React.FC<Props> = ({ ticket }) => {
  const [sentComments, commentRes] = useSentCommentsMutation();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  // console.log(isAdmin,pathname)
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState<TTicket['status']>(ticket.status);
  // const [, setPriority] = useState<TTicket['priority']>(ticket.priority);
  const [comments, setComments] = useState<TComment[]>(ticket.comments);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      author: 'Admin',
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    sentComments({ body: comment, ticketId: ticket.id });

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleStatusChange = (value: TTicket['status']) => {
    setStatus(value);
  };

  // const handlePriorityChange = (value: TTicket['priority']) => {
  //   setPriority(value);
  // };

  useEffect(() => {
    if (commentRes.data) {
      alert('Comment sent successfully');
    }
    if (commentRes.error) {
      alert('Failed to send comment');
    }
  }, [commentRes]);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 my-10">
      <h2 className="text-2xl font-semibold mb-4">{ticket?.subject}</h2>

      <div className="mb-4 space-y-1">
        <p><strong>Description:</strong> {ticket?.description}</p>
        <p><strong>Category:</strong> {ticket?.category}</p>

          <p>
            <strong>Priority:</strong>{' '}
            <span
              className={`text-${
                ticket.priority === 'High'
                  ? 'red'
                  : ticket.priority === 'Medium'
                  ? 'yellow'
                  : 'green'
              }-600`}
            >
              {ticket.priority}
            </span>
          </p>

        {isAdmin ? (
          <div className="flex gap-4 items-center mt-2">
            <label><strong>Status:</strong></label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p><strong>Status:</strong> {ticket?.status}</p>
        )}

        {ticket?.attachmentUrl && (
          <p>
            <strong>Attachment:</strong>{' '}
            <a
              href={ticket?.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View File
            </a>
          </p>
        )}
      </div>

      {/* Comments Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment?.id} className="border rounded-md p-3">
                <p className="text-sm text-gray-600">
                  {comment?.author} - {new Date(comment?.createdAt).toLocaleString()}
                </p>
                <p>{comment?.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Comment */}
      <form onSubmit={handleCommentSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full border border-gray-300 rounded-md p-2 mb-2"
          rows={3}
        />
        <Button disabled= {commentRes.isLoading} type="submit" className="w-full">
          {commentRes.isLoading ? 'Sending...' : 'Send Comment'}
        </Button>
      </form>
    </div>
  );
};

export default TicketShow;
