
"use client";

import type { User } from '@/types';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const USER_STORAGE_KEY = 'lifeline_user_v2'; // Changed key to ensure fresh start if needed

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
    // Initialize state from localStorage
    setLoading(true);
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // Basic validation of stored user structure
        if (parsedUser && typeof parsedUser.id === 'string' && typeof parsedUser.phoneNumber === 'string') {
          setUserState(parsedUser);
        } else {
          localStorage.removeItem(USER_STORAGE_KEY); // Clear invalid item
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem(USER_STORAGE_KEY); // Clear corrupted item
    } finally {
      setLoading(false);
    }
  }, []);

  const setCurrentUser = useCallback((userData: User | null) => {
    setLoading(true);
    if (userData && typeof userData.id === 'string' && typeof userData.phoneNumber === 'string') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUserState(userData);
    } else if (userData === null) { // Explicitly handle null to logout
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    } else {
      // Handle cases where userData is present but invalid
      console.warn("Attempted to set invalid user data:", userData);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    }
    setLoading(false);
  }, []);


  const logout = useCallback(async () => {
    setLoading(true);
    setCurrentUser(null); // This will clear localStorage and state
    // No need to await setCurrentUser as it's synchronous state/localStorage update
    router.push('/auth'); // Redirect to auth page on logout
    // setLoading(false) will be handled by setCurrentUser
  }, [router, setCurrentUser]);

  const authContextValue: AuthContextType = {
    user,
    loading,
    setCurrentUser,
    logout
  };

  // Destructure Provider for clarity and to potentially help the parser
  const Provider = AuthContext.Provider;

  return (
    <Provider value={authContextValue}>
      {children}
    </Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
