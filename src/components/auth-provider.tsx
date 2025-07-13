
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Skeleton } from './ui/skeleton';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  firebaseReady: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, firebaseReady: false });

const publicPaths = ['/login', '/about', '/legal', '/learn-more', '/care-circle'];


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect now correctly handles waiting for Firebase to be ready
    if (auth) {
      setFirebaseReady(true);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // If auth is not ready, we are not loading and there's no user.
      setLoading(false);
      setFirebaseReady(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return; // Wait until auth state is determined

    const isPublic = publicPaths.includes(pathname) || pathname === '/';
    
    // If Firebase isn't ready, don't redirect, allow public pages to render.
    if (!firebaseReady && !isPublic) {
        // You might want to show an error or a specific page here
        // For now, we'll redirect to login, but the login page will show a spinner.
        router.push('/login');
        return;
    }
    
    if (!user && !isPublic) {
      router.push('/login');
    } else if (user && pathname === '/login') {
      router.push('/');
    }

  }, [user, loading, pathname, router, firebaseReady]);


  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  const isPublic = publicPaths.includes(pathname) || pathname === '/';
  if (!user && !isPublic) {
      // This case is handled by the useEffect, but as a fallback, show a loader.
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
  }


  return (
    <AuthContext.Provider value={{ user, loading, firebaseReady }}>
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
