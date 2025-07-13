
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { innerWeatherSchema, InnerWeatherFormValues } from './form-schema';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/components/auth-provider';
import { saveMoodEntry, hasMoodEntryForToday } from '@/lib/firebase/service';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';


const OtherCheckboxInput = ({
  control,
  checkboxName,
  inputName,
  options,
}: {
  control: any;
  checkboxName: keyof InnerWeatherFormValues;
  inputName: string;
  options: string[];
}) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Controller
              control={control}
              name={checkboxName}
              render={({ field }) => (
                <Checkbox
                  value={option}
                  checked={field.value?.includes(option)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...(field.value || []), option])
                      : field.onChange(
                          (field.value || []).filter(
                            (value: string) => value !== option
                          )
                        );
                  }}
                />
              )}
            />
            <Label className="text-black font-normal">{option}</Label>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <Checkbox
          id={`${inputName}-checkbox`}
          checked={showOtherInput}
          onCheckedChange={(checked) => setShowOtherInput(!!checked)}
        />
        <Label htmlFor={`${inputName}-checkbox`} className="text-black font-normal">Other</Label>
      </div>
      {showOtherInput && (
        <Controller
          control={control}
          name={inputName}
          render={({ field }) => <Textarea {...field} placeholder="Please specify" className="bg-white text-black mt-2" />}
        />
      )}
    </div>
  );
};


export default function InnerWeatherPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [stressValue, setStressValue] = useState(5);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InnerWeatherFormValues>({
    resolver: zodResolver(innerWeatherSchema),
    defaultValues: {
      moodRating: undefined,
      emotions: [],
      emotionsOther: '',
      influences: [],
      influencesOther: '',
      stressLevel: 5,
      selfCareToday: '',
      personalNote: '',
    },
  });

  const onSubmit = async (data: InnerWeatherFormValues) => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const alreadyLogged = await hasMoodEntryForToday(user.uid);
      if (alreadyLogged) {
        toast({
          title: 'Already Logged',
          description: "You've already logged your mood today. You can only log once per day.",
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      await saveMoodEntry(user.uid, data);
      setSubmissionSuccess(true);
      toast({
        title: 'Success!',
        description: 'Your mood has been logged successfully.',
      });

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'There was a problem saving your mood entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submissionSuccess) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-cyan-100 p-4 sm:p-8 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-xl w-full text-center">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6">
                    Thank you for checking in with yourself today 💙
                </div>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg">
                    <Link href="/care-circle">Meet your counselling team</Link>
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-cyan-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-xl w-full">
        <h1 className="text-indigo-700 font-bold text-4xl mb-2">Inner Weather</h1>
        <p className="text-gray-600 text-lg mb-8">Check in with the climate of your mind.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Mood Rating */}
          <div>
            <Label className="font-semibold text-black">How would you rate your overall mood today?*</Label>
            <Controller
                name="moodRating"
                control={control}
                render={({ field }) => (
                    <RadioGroup onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)} className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="1" id="mood-1" /><Label htmlFor="mood-1" className="text-black font-normal">1 – Very low 😞</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="2" id="mood-2" /><Label htmlFor="mood-2" className="text-black font-normal">2 – Low</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="3" id="mood-3" /><Label htmlFor="mood-3" className="text-black font-normal">3 – Meh / Okay</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="4" id="mood-4" /><Label htmlFor="mood-4" className="text-black font-normal">4 – Good 😊</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="5" id="mood-5" /><Label htmlFor="mood-5" className="text-black font-normal">5 – Excellent 🌟</Label></div>
                    </RadioGroup>
                )}
            />
            {errors.moodRating && <p className="text-red-600 text-sm mt-1">{errors.moodRating.message}</p>}
          </div>

          {/* Current Emotions */}
          <div>
            <Label className="font-semibold text-black">What emotions are you feeling right now?</Label>
            <OtherCheckboxInput 
              control={control}
              checkboxName="emotions"
              inputName="emotionsOther"
              options={["Calm", "Happy", "Anxious", "Sad", "Angry", "Confused", "Grateful", "Lonely", "Hopeful", "Overwhelmed"]}
            />
          </div>

          {/* Mood Influences */}
          <div>
            <Label className="font-semibold text-black">What’s influencing your mood today?</Label>
             <OtherCheckboxInput 
              control={control}
              checkboxName="influences"
              inputName="influencesOther"
              options={["Work", "Relationships", "Health", "Sleep quality", "Financial concerns", "Recent event", "No specific reason"]}
            />
          </div>

          {/* Stress Level */}
          <div>
            <Label className="font-semibold text-black">How stressed do you feel right now?*</Label>
             <Controller
                name="stressLevel"
                control={control}
                render={({ field }) => (
                    <div className="mt-2">
                        <Slider
                            value={[field.value ?? 5]}
                            onValueChange={(value) => {
                                field.onChange(value[0]);
                                setStressValue(value[0]);
                            }}
                            max={10}
                            min={1}
                            step={1}
                        />
                        <div className="flex justify-between text-sm text-black mt-2">
                            <span>😌 1 (Very relaxed)</span>
                            <span>{stressValue}</span>
                            <span>😩 10 (Extremely stressed)</span>
                        </div>
                    </div>
                )}
            />
            {errors.stressLevel && <p className="text-red-600 text-sm mt-1">{errors.stressLevel.message}</p>}
          </div>
          
          {/* Self-Care */}
          <div>
            <Label className="font-semibold text-black">Have you taken time for yourself today?</Label>
            <Controller
                name="selfCareToday"
                control={control}
                render={({ field }) => (
                     <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="care-yes" /><Label htmlFor="care-yes" className="text-black font-normal">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Not yet" id="care-not-yet" /><Label htmlFor="care-not-yet" className="text-black font-normal">Not yet</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="care-no" /><Label htmlFor="care-no" className="text-black font-normal">No</Label></div>
                    </RadioGroup>
                )}
            />
          </div>
          
          {/* Free Note */}
          <div>
              <Label htmlFor="personalNote" className="font-semibold text-black">Would you like to note anything else about today?</Label>
              <Controller name="personalNote" control={control} render={({ field }) => <Textarea {...field} id="personalNote" className="bg-white text-black mt-2" />} />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit Mood Check-in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
