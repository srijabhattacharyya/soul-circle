
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LogoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const performLogout = async () => {
      if (auth) {
        try {
          await auth.signOut();
          toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
          });
          router.push('/');
        } catch (error) {
          console.error('Logout failed', error);
          toast({
            title: 'Error',
            description: 'Logout failed. Please try again.',
            variant: 'destructive',
          });
          router.push('/'); // Redirect even if there's an error
        }
      } else {
        // If firebase isn't configured, just redirect
        router.push('/');
      }
    };

    performLogout();
  }, [router, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex items-center space-x-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-semibold">Logging you out...</p>
      </div>
    </div>
  );
}
