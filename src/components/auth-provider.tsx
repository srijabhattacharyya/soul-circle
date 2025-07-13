
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

const publicPaths = ['/login', '/about', '/legal', '/learn-more', '/care-circle', '/learn-further'];


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isConfigValid) {
        // If Firebase is not configured, we are in offline mode.
        // No user is authenticated.
        setUser(null);
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

    // Allow access to the root path (landing page) for everyone.
    if (pathname === '/') return;

    const isPublic = publicPaths.includes(pathname);
    
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
  
  // If we are not loading, and trying to access a protected route without a user,
  // show a loader while we redirect to /login.
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
