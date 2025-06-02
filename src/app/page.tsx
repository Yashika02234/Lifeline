"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

function AuthGate() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth');
      }
    }
  }, [user, loading, router]);

  if (loading || (!user && typeof window !== 'undefined' && window.location.pathname !== '/auth') || (user && typeof window !== 'undefined' && window.location.pathname !== '/dashboard')) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 p-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse text-primary"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  return null; 
}

export default function HomePage() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
