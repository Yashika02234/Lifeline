
"use client";

import type { User } from '@/types';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const USER_STORAGE_KEY = 'lifeline_user_v2';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setCurrentUser: (userData: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // Basic validation for the parsed user object
        if (parsedUser && typeof parsedUser.id === 'string' && typeof parsedUser.phoneNumber === 'string') {
          setUserState(parsedUser);
        } else {
          // Invalid or incomplete user data found, clear it
          localStorage.removeItem(USER_STORAGE_KEY);
          setUserState(null);
        }
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      // Error parsing JSON, clear potentially corrupted data
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setCurrentUser = useCallback((userData: User | null) => {
    setLoading(true);
    if (userData && typeof userData.id === 'string' && typeof userData.phoneNumber === 'string') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUserState(userData);
    } else if (userData === null) {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    } else {
      // Attempted to set invalid user data
      console.warn("Attempted to set invalid user data:", userData);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true); 
    setCurrentUser(null); 
    // setLoading(false) will be called by setCurrentUser
    // Forcing redirect if desired, though ProtectedRouteLayout/AuthGate should handle it:
    router.replace('/auth'); 
  }, [router, setCurrentUser]);

  const authContextValue: AuthContextType = {
    user,
    loading,
    setCurrentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
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
