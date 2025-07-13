'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User, signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Skeleton } from './ui/skeleton';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Set to false to prevent loading screen

  useEffect(() => {
    // Simulate a logged-in user for development purposes
    const mockUser: User = {
      uid: 'dev-user-123',
      email: 'dev@soulcircle.com',
      displayName: 'Dev User',
      photoURL: '',
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      providerId: 'firebase',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => '',
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({}),
    };
    setUser(mockUser);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
        {loading ? (
             <div className="flex items-center justify-center h-screen">
                <div className="space-y-4 w-1/2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
