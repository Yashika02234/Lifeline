"use client";

import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import MainNav from './main-nav';
import UserNav from './user-nav';
import { useAuth } from '@/hooks/use-auth'; // Ensure this is used within AuthProvider context

export default function AppHeader() {
  // This component will be wrapped by AuthProvider at a higher level (e.g. in layout or page)
  // For now, we assume AuthProvider is available. If direct usage, this needs adjustment.
  // A simple way to handle this is to ensure that pages using Header are wrapped.
  // Let's remove direct useAuth here and pass props if necessary, or rely on context from page.
  // For this structure, layout.tsx wraps children, page.tsx wraps AuthGate with AuthProvider.
  // So, components rendered within children like AppHeader won't have direct access unless AuthProvider is moved to RootLayout.
  // Let's move AuthProvider to RootLayout.

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          <span className="font-headline font-bold text-xl text-primary">Lifeline</span>
        </Link>
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
