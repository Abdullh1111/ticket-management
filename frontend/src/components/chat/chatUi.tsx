'use client';

import {useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { TMessage } from '@/types/chat.interface';
import { getSocket } from '@/lib/socket';
import { Socket } from 'socket.io-client';
import { useChatHistoryQuery } from '@/redux/services/chat.service';
import LoadingSpinner from '../Loading';
import { useParams, usePathname } from 'next/navigation';


export default function ChatUi() {
  const socketRef = useRef<Socket | null>(null);
  let { chatid } = useParams() as { chatid: string };
  const chatHistoryRes = useChatHistoryQuery({ userId: chatid || '' });

  const [messages, setMessages] = useState<TMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  let userId : string = "";
  chatid = chatid || "cd6dbe01-a363-4cb9-aab6-438a6f3420db";
  useEffect(() => {
    
   userId = localStorage.getItem('userId') as string;
  }, []);
  // Register user and listen for incoming messages
    useEffect(() => {
    socketRef.current = getSocket();

    if (socketRef.current) {
      socketRef.current.on('connect', () => {
        console.log('Connected:', socketRef.current?.id);
        socketRef.current?.emit('registerUser', { userId });
      });

      socketRef.current.on('receiveMessage', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      socketRef.current?.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: TMessage = {
      sender: isAdmin ? 'ADMIN' : 'USER',
      content: newMessage,
      receiverId: chatid,
      senderId: userId,
    };

    socketRef.current?.emit('sendMessage', newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (chatHistoryRes.data) {
      setMessages(chatHistoryRes.data);
    }
    if (chatHistoryRes.error) {
      alert('Failed to fetch chat history');
    }
  }, [chatHistoryRes]);

  return chatHistoryRes.isLoading ? (
    <div className="flex justify-center min-h-screen items-center">
      <LoadingSpinner /> Loading...
    </div>
  ) : (
    <div className="flex flex-col h-[95vh] w-full mx-auto border rounded-xl p-4 bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-2">Chat with Support</h3>

      <ScrollArea className="flex-1 overflow-y-auto border rounded-md p-3 mb-4 bg-gray-50">
        <div className="flex flex-col space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'max-w-[75%] px-4 py-2 rounded-lg',
                msg.sender === (isAdmin ? 'ADMIN' : 'USER')
                  ? 'self-end bg-blue-100 text-right'
                  : 'self-start bg-gray-200 text-left'
              )}
            >
              <p className="text-sm">{msg.content}</p>
              {msg.createdAt && (
                <span className="text-xs text-gray-500 block mt-1">
                  {msg.createdAt}
                </span>
              )}
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
