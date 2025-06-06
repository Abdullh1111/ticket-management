'use client'
import { useLogoutMutation } from '@/redux/services/auth.service';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function LogoutButton() {
    const router = useRouter();
  const [logout, { isLoading, data, error }] = useLogoutMutation();

  const handleLogout = () => {
    logout();
  }

  useEffect(() => {
    if (data) {
      alert('Logout successful!');
      router.push('/login');
    }
    if (error) {
      alert('Logout failed!');
    }
  }, [data, error, isLoading, router]);
  return (
      <button disabled={isLoading} onClick={handleLogout} className="text-red-500 hover:underline w-full bg-red-100 py-3 mb-2">
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
  )
}
