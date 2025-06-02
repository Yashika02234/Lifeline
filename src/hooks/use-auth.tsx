"use client";

import type { User } from '@/types';
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

const USER_STORAGE_KEY = 'lifeline_user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY); 
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (phoneNumber: string, otp: string): Promise<boolean> => {
    // Mock OTP verification
    // In a real app, this would involve an API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    if (otp === "123456") { // Hardcoded OTP for demo
      const newUser: User = { id: Date.now().toString(), phoneNumber };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setLoading(false);
    router.push('/auth'); // Redirect to auth page on logout
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
