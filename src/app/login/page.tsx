
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setupRecaptcha, sendVerificationCode, verifyCode } from '@/lib/firebase/service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, MessageSquare } from 'lucide-react';
import { getAuth, type ConfirmationResult } from 'firebase/auth';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input/react-hook-form-input';
import 'react-phone-number-input/style.css'
import { useForm, FormProvider } from 'react-hook-form';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const formMethods = useForm<{ phone: string; code: string }>();
  const { control, handleSubmit } = formMethods;

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    const auth = getAuth();
    setupRecaptcha(auth, 'recaptcha-container').catch(err => {
        console.error("Recaptcha setup failed", err);
        toast.error("Could not initialize sign-in process. Please refresh the page.");
    });
  }, []);

  const handleSendCode = async ({ phone }: { phone: string }) => {
    setIsSendingCode(true);
    toast.loading('Sending verification code...');
    try {
        const auth = getAuth();
        const result = await sendVerificationCode(auth, phone);
        setConfirmationResult(result);
        setStep('otp');
        toast.dismiss();
        toast.success('Verification code sent!');
    } catch (error: any) {
      console.error(error);
      toast.dismiss();
      toast.error(error.message || 'Failed to send code. Please check the number and try again.');
    } finally {
      setIsSendingCode(false);
    }
  };
  
  const handleVerifyCode = async ({ code }: { code: string }) => {
    if (!confirmationResult) return;
    setIsVerifying(true);
    toast.loading('Verifying code...');
    try {
        await verifyCode(confirmationResult, code);
        toast.dismiss();
        toast.success('Login successful!');
        router.push('/');
    } catch (error: any) {
        console.error(error);
        toast.dismiss();
        toast.error(error.message || 'Invalid verification code. Please try again.');
    } finally {
        setIsVerifying(false);
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Welcome to SoulCircle</h1>
        <p className="text-gray-600 mb-8 md:text-lg">
            {step === 'phone' ? 'Enter your phone number to begin.' : 'Enter the code we sent you.'}
        </p>
        
        <FormProvider {...formMethods}>
            {step === 'phone' ? (
                <form onSubmit={handleSubmit(handleSendCode)} className="space-y-6 text-left">
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <PhoneInput
                            name="phone"
                            control={control}
                            rules={{ required: true }}
                            defaultCountry="IN"
                            className="text-black"
                            inputComponent={Input}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSendingCode}>
                        {isSendingCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Phone className="mr-2" />}
                        Send Verification Code
                    </Button>
                </form>
            ) : (
                 <form onSubmit={handleSubmit(handleVerifyCode)} className="space-y-6 text-left">
                    <div>
                        <Label htmlFor="code">Verification Code</Label>
                        <Input
                            {...formMethods.register('code')}
                            id="code"
                            type="text"
                            maxLength={6}
                            placeholder="_ _ _ _ _ _"
                            className="text-center tracking-[1em]"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isVerifying}>
                        {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2" />}
                        Verify & Sign In
                    </Button>
                    <Button variant="link" onClick={() => setStep('phone')}>
                        Use a different number
                    </Button>
                </form>
            )}
        </FormProvider>

        <div id="recaptcha-container" className="mt-8 flex justify-center"></div>
      </div>
    </div>
  );
}
