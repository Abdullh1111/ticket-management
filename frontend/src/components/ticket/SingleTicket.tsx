'use client';

import { TComment, TTicket } from '@/types/Ticket.interface';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useParams, usePathname } from 'next/navigation';
import { useFineOneTicketQuery, useSentCommentsMutation, useUpdateTicketMutation } from '@/redux/services/ticket.service';
import LoadingSpinner from '@/components/Loading';


const SingleTicketShow: React.FC = () => {
  const [ticket, setTicket] = useState<TTicket>({
    id: '',
    subject: '',
    description: '',
    category: 'Technical',
    priority: 'Low',
    status: 'Open',
    attachmentUrl: '',
    comments: [],
  });
  const { id } = useParams() as { id: string };
  const singleTicket = useFineOneTicketQuery(id);
  const [sentComments, commentRes] = useSentCommentsMutation();
  const [updateTicket, updateTicketRes] = useUpdateTicketMutation();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  // console.log(isAdmin,pathname)
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<TComment[]>(ticket?.comments);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      author: 'Admin',
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    sentComments({ body: comment, ticketId: ticket?.id });

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleStatusChange = (value: TTicket['status']) => {
    console.log(ticket?.id)
    updateTicket({ body: { status: value }, ticketId: ticket?.id });
  };

  useEffect(() => {
    if (commentRes.data) {
      alert('Comment sent successfully');
    }
    if (commentRes.error) {
      alert('Failed to send comment');
    }
  }, [commentRes]);

  useEffect(() => {
    if (updateTicketRes.data) {
      alert('Ticket updated successfully');
    }
    if (updateTicketRes.error) {
      console.log(updateTicketRes.error)
      alert('Failed to update ticket');
    }
  }, [updateTicketRes]);
  console.log(ticket)

  useEffect(() => {
    if (singleTicket.data) {
      setTicket(singleTicket.data);
      setComments(singleTicket.data.comments);
    }
    if (singleTicket.error) {
      alert('Failed to fetch ticket');
    }
  }, [singleTicket]);

    if (singleTicket.isLoading) {
    return (
      <div className='flex justify-center min-h-screen items-center'><LoadingSpinner /> Loading...</div>
    );
  }

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
                ticket?.priority === 'High'
                  ? 'red'
                  : ticket?.priority === 'Medium'
                  ? 'yellow'
                  : 'green'
              }-600`}
            >
              {ticket?.priority}
            </span>
          </p>

        {isAdmin ? (
          <div className="flex gap-4 items-center mt-2">
            <label><strong>Status:</strong></label>
            <Select value={ticket?.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
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
        {comments?.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments?.map((comment) => (
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

export default SingleTicketShow;
