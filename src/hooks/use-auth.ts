
"use client";

import type { User } from '@/types'; // This is our client-side User type
import { useState, useEffect, useCallback, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

const USER_STORAGE_KEY = 'lifeline_user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setCurrentUser: (userData: User | null) => void; 
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY); 
    } finally {
      setLoading(false);
    }
  }, []);

  const setCurrentUser = useCallback((userData: User | null) => {
    setLoading(true);
    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUserState(userData);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    }
    setLoading(false);
  }, []);


  const logout = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    setCurrentUser(null); // This will clear localStorage and state
    setLoading(false);
    router.push('/auth'); // Redirect to auth page on logout
  }, [router, setCurrentUser]);

  return (
    <AuthContext.Provider value={{ user, loading, setCurrentUser, logout }}>
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
