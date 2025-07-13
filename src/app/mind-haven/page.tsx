
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { journalSchema, type JournalFormValues } from './form-schema';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { saveJournalEntry } from '@/lib/firebase/service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const prompts = [
  "What made you pause today?",
  "What do you wish someone understood?",
  "What are you carrying that you want to let go of?",
  "What small joy did you experience today?",
  "If your emotions were weather, what would today's forecast be?",
];

export default function MindHavenPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      entryText: '',
      moodTag: '',
    },
  });

  const handleTogglePrompt = () => {
    if (!showPrompt) {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setCurrentPrompt(randomPrompt);
    }
    setShowPrompt(!showPrompt);
  };

  useEffect(() => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
  }, []);

  const onSubmit = async (data: JournalFormValues) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save an entry.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await saveJournalEntry(user.uid, data);
      toast({
        title: 'Success!',
        description: 'Your words have been gently saved. Come back anytime.',
      });
      reset(); // Clear the form for a new entry
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'There was a problem saving your entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 max-w-3xl w-full h-[90vh] flex flex-col border border-gray-200">
        <header className="text-center mb-6">
            <svg
                className="h-10 w-10 mx-auto text-indigo-300 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20 12.5a8.5 8.5 0 0 0-17 0" />
                <path d="M4 12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4" />
                <path d="M12 2v2" />
                <path d="M12 18v2" />
            </svg>
          <h1 className="text-indigo-700 font-bold text-4xl mb-2">Mind Haven</h1>
          <p className="text-gray-600 text-lg">A sanctuary for your thoughts</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          <div className="flex-1">
            <Controller
              name="entryText"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Write whatever is on your mind today..."
                  className="flex-1 w-full p-4 bg-transparent border-none focus:outline-none resize-none overflow-y-auto text-gray-800 leading-relaxed h-full"
                />
              )}
            />
            {errors.entryText && <p className="text-red-600 text-sm mt-1">{errors.entryText.message}</p>}
          </div>
          
          <div className="mt-4 space-y-4">
             <div>
                <Label htmlFor="moodTag" className="text-gray-700 font-medium text-sm mb-2 block">How are you feeling right now?</Label>
                <Controller
                  name="moodTag"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="moodTag" className="p-2 rounded-lg border border-gray-300 bg-white focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto text-black">
                            <SelectValue placeholder="Select a mood" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="😊 Happy">😊 Happy</SelectItem>
                            <SelectItem value="😐 Neutral">😐 Neutral</SelectItem>
                            <SelectItem value="😞 Sad">😞 Sad</SelectItem>
                            <SelectItem value="😠 Angry">😠 Angry</SelectItem>
                            <SelectItem value="🥺 Anxious">🥺 Anxious</SelectItem>
                            <SelectItem value="💭 Reflective">💭 Reflective</SelectItem>
                        </SelectContent>
                    </Select>
                  )}
                />
            </div>

            <div>
                <Button type="button" onClick={handleTogglePrompt} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition">
                    {showPrompt ? 'Hide Prompt' : 'Need a prompt?'}
                </Button>
                {showPrompt && (
                    <div className="bg-indigo-50 text-indigo-800 p-3 rounded-lg italic text-sm mt-2 border border-indigo-200">
                        {currentPrompt}
                    </div>
                )}
            </div>
          </div>

          <Button type="submit" className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out mt-6" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Entry'}
          </Button>
        </form>
      </div>
    </div>
  );
}
