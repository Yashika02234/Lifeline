
"use client";

import type { User } from '@/types';
import React, { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // Robust check for user object structure
        if (parsedUser && typeof parsedUser.id === 'string' && typeof parsedUser.phoneNumber === 'string') {
          setUserState(parsedUser);
        } else {
          console.warn("Invalid user data structure in localStorage. Clearing.");
          localStorage.removeItem(USER_STORAGE_KEY);
          setUserState(null);
        }
      } else {
        setUserState(null);
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      // Ensure local storage is cleared on error
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setCurrentUser = useCallback((userData: User | null) => {
    setLoading(true); // Indicate loading state during user update
    if (userData && typeof userData.id === 'string' && typeof userData.phoneNumber === 'string') {
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        setUserState(userData);
      } catch (error) {
        console.error("Error writing user to localStorage:", error);
        setUserState(null); // Fallback to no user if storage fails
      }
    } else if (userData === null) {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    } else {
      console.warn("Attempted to set invalid user data:", userData);
      localStorage.removeItem(USER_STORAGE_KEY); 
      setUserState(null);
    }
    setLoading(false); // Update loading state after operation
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setCurrentUser(null);
    // Ensure navigation happens after state update.
    await new Promise(resolve => setTimeout(resolve, 0)); 
    router.replace('/auth');
    // setLoading(false) is handled by setCurrentUser
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
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
