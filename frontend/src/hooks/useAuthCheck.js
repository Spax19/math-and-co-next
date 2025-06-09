// hooks/useAuthCheck.js
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthCheck(requiredRole) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (requiredRole && user.userType !== requiredRole))) {
      router.push('/');
    }
  }, [user, loading, requiredRole, router]);

  return { user, loading };
}