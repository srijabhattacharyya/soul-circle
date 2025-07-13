
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail, signUpWithEmail } from '@/lib/firebase/service';
import { isConfigValid } from '@/lib/firebase/config';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: LoginFormValues) => {
    if (!isConfigValid) {
        toast({ title: "Offline Mode", description: "Cannot sign in while in offline mode.", variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    try {
      if (isLoginView) {
        await signInWithEmail(data.email, data.password);
        toast({ title: 'Success', description: 'Logged in successfully!' });
      } else {
        await signUpWithEmail(data.email, data.password);
        toast({ title: 'Success', description: 'Account created successfully! You are now logged in.' });
      }
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Authentication Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading || user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {isLoginView ? 'Welcome Back' : 'Create Your Account'}
        </h1>
        <p className="text-gray-600 mb-8 md:text-lg">
          {isLoginView ? 'Sign in to continue your journey.' : 'Join SoulCircle to get started.'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className="bg-secondary text-foreground placeholder:text-foreground/60"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="bg-secondary text-foreground placeholder:text-foreground/60"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isLoginView ? (
              <LogIn className="mr-2" />
            ) : (
              <UserPlus className="mr-2" />
            )}
            {isLoginView ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6">
          <Button variant="link" onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </Button>
        </div>
      </div>
    </div>
  );
}
