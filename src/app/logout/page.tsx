
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '@/components/auth-provider';
import { saveUserFeedback } from '@/lib/firebase/service';
import { Loader2, Star, Heart, Sun, Notebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { isConfigValid } from '@/lib/firebase/config';

const affirmations = [
    "You made space for your feelings today. That's a win.",
    "Rest is a productive part of your journey.",
    "Your story is still unfolding, and that is beautiful.",
    "You are worthy of peace and calm.",
    "Be gentle with yourself. You're doing your best.",
];

export default function LogoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [randomAffirmation, setRandomAffirmation] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setRandomAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
  }, []);

  const handleFeedbackSubmit = async () => {
    setIsSubmittingFeedback(true);
    try {
      await saveUserFeedback({
        uid: user?.uid ?? 'anonymous',
        rating: selectedRating,
        text: feedbackText,
      });
      setFeedbackSubmitted(true);
      toast({
        title: 'Thank You!',
        description: 'Your feedback has been received.',
      });
    } catch (error) {
      console.error('Feedback submission failed', error);
      toast({
        title: 'Error',
        description: 'Could not submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
        if (isConfigValid) {
            const auth = getAuth();
            await signOut(auth);
        }
        toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
        });
        router.push('/login');
    } catch (error) {
        console.error('Logout failed', error);
        toast({
            title: 'Error',
            description: 'Logout failed. Please try again.',
            variant: 'destructive',
        });
        setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 md:p-10 text-center">
        <CardHeader>
          <div className="flex justify-center items-center gap-4 mb-4 text-purple-400">
             <Sun className="h-8 w-8" />
             <Heart className="h-8 w-8" />
             <Notebook className="h-8 w-8" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-800">Until Next Time</CardTitle>
          <p className="text-lg text-gray-600 mt-2">{randomAffirmation}</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {!feedbackSubmitted ? (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-700">How was your session?</h3>
              <p className="text-sm text-gray-500 mb-4">Your feedback helps us grow.</p>
              <div className="flex justify-center items-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                    role="button"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        (hoverRating || selectedRating) >= star
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Share your thoughts, suggestions, or feelings..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="bg-white text-black"
              />
              <Button onClick={handleFeedbackSubmit} disabled={isSubmittingFeedback || selectedRating === 0} className="mt-4">
                {isSubmittingFeedback ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit Feedback'}
              </Button>
            </div>
          ) : (
             <div role="alert" className="bg-green-50 text-green-700 p-4 rounded-lg font-semibold">
                Feedback submitted! Thank you for helping us improve.
             </div>
          )}

          <div className="border-t border-gray-200 pt-8 space-y-4">
            <p className="text-gray-600 italic">Your story deserves space. Come back whenever you need support.</p>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full max-w-xs mx-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              size="lg"
            >
              {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log out and Exit'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
