
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, isConfigValid } from '@/lib/firebase/config';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  firebaseReady: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, firebaseReady: false });

const publicPaths = ['/login', '/about', '/legal', '/learn-more', '/care-circle'];

const mockUser: User = {
    uid: 'dev-user',
    displayName: 'Dev User',
    email: 'dev@example.com',
    photoURL: 'https://placehold.co/100x100',
    providerId: 'google.com',
    emailVerified: true,
} as User;


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isConfigValid) {
        console.warn("Firebase config is invalid. Using mock user for development.");
        setUser(mockUser);
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; 

    const isPublic = publicPaths.includes(pathname) || pathname === '/';
    
    if (!user && !isPublic) {
      router.push('/login');
    } else if (user && pathname === '/login') {
      router.push('/');
    }

  }, [user, loading, pathname, router]);


  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  const isPublic = publicPaths.includes(pathname) || pathname === '/';
  if (!user && !isPublic) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
  }

  return (
    <AuthContext.Provider value={{ user, loading, firebaseReady: isConfigValid }}>
        {children}
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
