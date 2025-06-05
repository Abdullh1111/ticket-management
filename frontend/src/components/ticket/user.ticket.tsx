"use client";

import { TTicket } from "@/types/Ticket.interface";
import { useState } from "react";

type Props = {
  ticket: TTicket;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TicketShow: React.FC<Props> = ({ ticket }) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setNewComment('');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 my-10">
      <h2 className="text-2xl font-semibold mb-4">{ticket?.subject}</h2>

      <div className="mb-4">
        <p><strong>Description:</strong> {ticket?.description}</p>
        <p><strong>Category:</strong> {ticket?.category}</p>
        <p><strong>Priority:</strong> <span className={`text-${ticket.priority === 'High' ? 'red' : ticket?.priority === 'Medium' ? 'yellow' : 'green'}-600`}>{ticket?.priority}</span></p>
        <p><strong>Status:</strong> {ticket?.status}</p>
        {ticket?.attachmentUrl && (
          <p>
            <strong>Attachment:</strong> <a href={ticket?.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View File</a>
          </p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        {ticket?.comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {ticket?.comments.map(comment => (
              <li key={comment.id} className="border rounded-md p-3">
                <p className="text-sm text-gray-600">{comment.author} - {new Date(comment.created_at).toLocaleString()}</p>
                <p>{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full border border-gray-300 rounded-md p-2 mb-2"
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default TicketShow;
