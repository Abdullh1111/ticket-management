'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAllUserQuery } from '@/redux/services/auth.service';
import LoadingSpinner from '@/components/Loading';

type User = {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  profile: {
    fullName: string;
  }
};

const AdminChatUserList = () => {
  const [search, setSearch] = useState('');
  const {data, isLoading, error} = useAllUserQuery();
  const [dummyUsers, setDummyUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data) {
      const users = data.filter((user: User) => user.role !== 'ADMIN');
      setDummyUsers(users);
    }

    if (error){
      alert("Failed to fetch users")
    }
  }, [data, isLoading, error]);

  const filteredUsers = dummyUsers.filter(
    user =>
      user.profile.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    isLoading ? 
      <div className='flex justify-center min-h-screen items-center'><LoadingSpinner /> Loading...</div>:
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
                  <p className="font-semibold">{user.profile.fullName}</p>
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
