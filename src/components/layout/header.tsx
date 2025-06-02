"use client";

import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import MainNav from './main-nav';
import UserNav from './user-nav';
// useAuth is no longer directly called here but in MainNav and UserNav,
// which will now correctly be within AuthProvider context due to changes in src/app/layout.tsx

export default function AppHeader() {
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
