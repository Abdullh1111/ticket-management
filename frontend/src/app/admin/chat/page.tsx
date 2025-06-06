'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

const dummyUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Abu Talib', email: 'abu@example.com' },
];

const AdminChatUserList = () => {
  const [search, setSearch] = useState('');

  const filteredUsers = dummyUsers.filter(
    user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Select User to Chat</h2>
      <Input
        placeholder="Search user by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-80 rounded-md border p-2">
        <div className="space-y-2">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <Link key={user.id} href={`/admin/chat/${user.id}`}>
                <Card className="p-4 cursor-pointer hover:bg-gray-100 transition-all">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </Card>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminChatUserList;
