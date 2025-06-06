
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

// Explicitly typing AuthProvider as a React Functional Component
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
        // Basic validation for the parsed user object
        if (parsedUser && typeof parsedUser.id === 'string' && typeof parsedUser.phoneNumber === 'string') {
          setUserState(parsedUser);
        } else {
          // Invalid user structure, remove from storage
          localStorage.removeItem(USER_STORAGE_KEY);
          setUserState(null);
        }
      } else {
        setUserState(null); // Ensure user is null if nothing is in storage
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      // Clear potentially corrupted data
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setCurrentUser = useCallback((userData: User | null) => {
    setLoading(true); // Indicate loading state during user update
    if (userData && typeof userData.id === 'string' && typeof userData.phoneNumber === 'string') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUserState(userData);
    } else if (userData === null) {
      // Explicitly handling null to clear user
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    } else {
      // Handle potentially invalid, non-null userData that doesn't meet criteria
      console.warn("Attempted to set invalid user data:", userData);
      localStorage.removeItem(USER_STORAGE_KEY); // Ensure storage is clean
      setUserState(null);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setCurrentUser(null); // This will remove from localStorage and update state
    // Ensure navigation happens after state update and potential re-renders:
    // Using a microtask (Promise.resolve().then()) or a minimal setTimeout
    // can help ensure state updates propagate before navigation.
    await Promise.resolve(); 
    router.replace('/auth');
    // setLoading(false); // setLoading(false) in setCurrentUser handles this
  }, [router, setCurrentUser]);

  // Define the context value object
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
