"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search, UserPlus, Award } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/dashboard', label: 'Find Donors', icon: Search, authRequired: true },
  { href: '/register-donor', label: 'Register as Donor', icon: UserPlus, authRequired: true },
  { href: '/rewards', label: 'My Rewards', icon: Award, authRequired: true },
];

export default function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth(); // Assuming AuthProvider is in a higher component like layout

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => {
        if (item.authRequired && !user) {
          return null;
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-foreground/60"
            )}
          >
            <item.icon className="mr-2 inline-block h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
