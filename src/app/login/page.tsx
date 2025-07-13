
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/lib/firebase/service';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase/config'; // Import auth to check initialization

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.226-11.283-7.581l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.846 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // Check if Firebase is ready
    if (auth) {
      setFirebaseReady(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  const handleSignIn = async () => {
    if (!firebaseReady) {
        toast({ title: 'Error', description: 'Authentication service is not ready.', variant: 'destructive' });
        return;
    }
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      toast({ title: 'Success!', description: 'You have logged in successfully.' });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsSigningIn(false);
    }
  };

  if (loading || user || !firebaseReady) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to SoulCircle</h1>
        <p className="text-gray-600 mb-8">Sign in to continue your journey.</p>
        <Button
          onClick={handleSignIn}
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-sm"
          disabled={isSigningIn}
        >
          {isSigningIn ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
