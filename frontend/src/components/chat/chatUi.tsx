'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { TMessage } from '@/types/chat.interface';



export default function ChatUi() {
  const [messages, setMessages] = useState<TMessage[]>([
    {
      id: 1,
      sender: 'admin',
      content: 'Hello! How can I help you today?',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      sender: 'user',
      content: 'I need help with my recent ticket regarding billing.',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: TMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');

    // Simulate admin response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          sender: 'admin',
          content: 'Thanks for your message. We are looking into it.',
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 1000);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[95vh] w-full mx-auto border rounded-xl p-4 bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-2">Chat with Support</h3>

      <ScrollArea className="flex-1 overflow-y-auto border rounded-md p-3 mb-4 bg-gray-50">
        <div className="flex flex-col space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-[75%] px-4 py-2 rounded-lg',
                msg.sender === 'user'
                  ? 'self-end bg-blue-100 text-right'
                  : 'self-start bg-gray-200 text-left'
              )}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
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
