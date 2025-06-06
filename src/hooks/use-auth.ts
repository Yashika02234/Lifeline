
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
          console.warn("Invalid user data found in localStorage, removing.");
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      // Clear potentially corrupted data
      localStorage.removeItem(USER_STORAGE_KEY);
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
      // Explicitly null means logout or clear user
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    } else {
      // Handle cases where userData is defined but invalid
      console.warn("Attempted to set invalid user data, clearing user:", userData);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setCurrentUser(null); // This also handles localStorage removal and state update
    // Using router.replace to avoid adding to history stack after logout
    router.replace('/auth');
  }, [router, setCurrentUser]);
  
  const authContextValue: AuthContextType = {
    user,
    loading,
    setCurrentUser,
    logout,
  };

  // Explicitly define the Provider component type and assign AuthContext.Provider to it
  const ProviderComponent: React.FC<{ value: AuthContextType; children: ReactNode }> = AuthContext.Provider;

  return (
    <ProviderComponent value={authContextValue}>
      {children}
    </ProviderComponent>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
