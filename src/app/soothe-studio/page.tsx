
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Heart, Wind, Sparkles, Target } from 'lucide-react';
import { generateAffirmations } from '@/ai/flows/affirmation-flow';
import { saveAffirmation, saveUserGoal } from '@/lib/firebase/service';
import { cn } from '@/lib/utils';

type BreathingType = 'box' | 'ocean' | '4-7-8';
type AffirmationCategory = 'Morning Boost' | 'Low Mood Days' | 'Confidence & Boundaries' | 'Self-Compassion';

const breathingPatterns: Record<BreathingType, { name: string; pattern: { text: string; duration: number }[] }> = {
  box: {
    name: "Box Breathing",
    pattern: [
      { text: "Inhale", duration: 4 },
      { text: "Hold", duration: 4 },
      { text: "Exhale", duration: 4 },
      { text: "Hold", duration: 4 },
    ],
  },
  ocean: {
    name: "Ocean Breath",
    pattern: [
      { text: "Inhale", duration: 5 },
      { text: "Exhale", duration: 5 },
    ],
  },
  '4-7-8': {
    name: "4-7-8 Relaxation Breath",
    pattern: [
      { text: "Inhale", duration: 4 },
      { text: "Hold", duration: 7 },
      { text: "Exhale", duration: 8 },
    ],
  },
};

const BreathingCircle = ({ type }: { type: BreathingType }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pattern = breathingPatterns[type].pattern;
  const totalDuration = pattern.reduce((acc, step) => acc + step.duration, 0);

  useEffect(() => {
    if (isActive) {
      const startCycle = () => {
        let stepIndex = 0;
        
        const updateStep = () => {
          setCurrentStep(stepIndex);
          if (pattern[stepIndex]) {
            const currentStepDuration = pattern[stepIndex].duration * 1000;
            stepIndex = (stepIndex + 1) % pattern.length;
            intervalRef.current = setTimeout(updateStep, currentStepDuration);
          }
        };
        
        updateStep();
      };
      
      startCycle();
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      setCurrentStep(0);
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, type, pattern]);

  const animationDuration = isActive ? `${totalDuration}s` : '0s';
  const animationClass = isActive && pattern[currentStep]?.text.includes('Inhale') ? 'animate-inhale' : 'animate-exhale';
  const textAnimation = isActive ? 'animate-pulse' : '';

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div
        className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center transition-transform duration-1000 ease-in-out"
        style={{
           animation: isActive && pattern[currentStep] ? `${pattern[currentStep].text.toLowerCase().includes('inhale') ? 'inhale' : 'exhale'} ${pattern[currentStep].duration}s ease-in-out forwards` : 'none',
        }}
      >
        <div className="text-center">
          <p className={`text-2xl font-semibold text-indigo-800 ${textAnimation}`}>
            {isActive && pattern[currentStep] ? pattern[currentStep].text : "Ready?"}
          </p>
          {isActive && pattern[currentStep] && (
            <p className="text-4xl font-bold text-indigo-600">{pattern[currentStep].duration}</p>
          )}
        </div>
      </div>
      <div className="flex space-x-4">
        <Button onClick={() => setIsActive(true)} disabled={isActive}>Start Session</Button>
        <Button onClick={() => setIsActive(false)} disabled={!isActive} variant="outline">Stop Session</Button>
      </div>
    </div>
  );
};


export default function SootheStudioPage() {
  const [activeTab, setActiveTab] = useState('breathing');
  const [breathingType, setBreathingType] = useState<BreathingType>('box');
  const [affirmationCategory, setAffirmationCategory] = useState<AffirmationCategory>('Morning Boost');
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Goal State
  const [mainGoal, setMainGoal] = useState('');
  const [subGoals, setSubGoals] = useState(['', '', '']);
  const [goalTime, setGoalTime] = useState('Daily');
  const [goalMood, setGoalMood] = useState('Anxious');


  const handleSubGoalChange = (index: number, value: string) => {
    const newSubGoals = [...subGoals];
    newSubGoals[index] = value;
    setSubGoals(newSubGoals);
  };

  const handleSaveGoal = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    if (!mainGoal.trim()) {
        toast({ title: "Error", description: "Main goal cannot be empty.", variant: "destructive" });
        return;
    }

    setIsSaving(true);
    try {
        await saveUserGoal(user.uid, {
            mainGoal,
            subGoals: subGoals.filter(g => g.trim() !== ''),
            timeFocus: goalTime,
            moodFocus: goalMood,
            completed: false,
        });
        toast({ title: "Success", description: "Your goal has been saved." });
        setMainGoal('');
        setSubGoals(['','','']);
    } catch(error) {
        console.error(error);
        toast({ title: "Error", description: "Could not save your goal.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  }
  
  const fetchAffirmations = async (category: AffirmationCategory) => {
    setIsGenerating(true);
    setAffirmations([]);
    setCurrentAffirmationIndex(0);
    try {
      const result = await generateAffirmations({ category });
      setAffirmations(result.affirmations);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Could not generate affirmations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'affirmations' && affirmations.length === 0) {
      fetchAffirmations(affirmationCategory);
    }
  }, [activeTab]);

  const handleNextAffirmation = () => {
    setCurrentAffirmationIndex((prev) => (prev + 1) % affirmations.length);
  };
  
  const handleSaveAffirmation = async () => {
     if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    const affirmationToSave = affirmations[currentAffirmationIndex];
    if (!affirmationToSave) return;
    
    setIsSaving(true);
    try {
      await saveAffirmation(user.uid, affirmationToSave);
      toast({ title: "Success", description: "Affirmation saved to your favorites." });
    } catch (error) {
       console.error(error);
       toast({ title: "Error", description: "Could not save affirmation.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'breathing':
        return (
          <div className="text-center p-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Guided Breathing</h2>
            <p className="text-gray-600 mb-6">Find your calm and center your mind.</p>
            <div className="mb-8">
              <RadioGroup value={breathingType} onValueChange={(v) => setBreathingType(v as BreathingType)} className="flex justify-center gap-4 sm:gap-8">
                {Object.keys(breathingPatterns).map((key) => (
                    <div className="flex items-center space-x-2" key={key}>
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="text-base text-black">{breathingPatterns[key as BreathingType].name}</Label>
                    </div>
                ))}
              </RadioGroup>
            </div>
            <BreathingCircle type={breathingType} />
          </div>
        );
      case 'affirmations':
        return (
           <div className="text-center p-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Positive Affirmations</h2>
            <p className="text-gray-600 mb-6">Rewire your thoughts with powerful statements.</p>
             <div className="max-w-md mx-auto mb-6">
                <Select
                    value={affirmationCategory}
                    onValueChange={(v) => {
                        const newCat = v as AffirmationCategory;
                        setAffirmationCategory(newCat);
                        fetchAffirmations(newCat);
                    }}
                >
                    <SelectTrigger className="w-full text-black bg-white">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Morning Boost">Morning Boost</SelectItem>
                        <SelectItem value="Low Mood Days">Low Mood Days</SelectItem>
                        <SelectItem value="Confidence & Boundaries">Confidence & Boundaries</SelectItem>
                        <SelectItem value="Self-Compassion">Self-Compassion</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <Card className="min-h-[200px] flex items-center justify-center p-8 bg-indigo-50 border-indigo-200">
                <CardContent className="p-0">
                    {isGenerating ? (
                        <div className="flex items-center space-x-2 text-gray-500">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Generating affirmations...</span>
                        </div>
                    ) : affirmations.length > 0 ? (
                        <p className="text-2xl font-semibold text-indigo-800 italic">"{affirmations[currentAffirmationIndex]}"</p>
                    ) : (
                       <p className="text-gray-500">Select a category to begin.</p>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-center items-center space-x-4 mt-6">
                 <Button onClick={() => fetchAffirmations(affirmationCategory)} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Give me another'}
                 </Button>
                 <Button onClick={handleNextAffirmation} disabled={affirmations.length <= 1}>Next</Button>
                 <Button onClick={handleSaveAffirmation} variant="outline" size="icon" className="rounded-full" disabled={isSaving || affirmations.length === 0}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-5 w-5 text-red-500" />}
                    <span className="sr-only">Save Affirmation</span>
                 </Button>
            </div>
          </div>
        );
      case 'goal-setting':
        return (
          <div className="p-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Mindful Goal Setting</h2>
            <p className="text-gray-600 text-center mb-6">Set intentions that align with your well-being.</p>
            <div className="space-y-6 max-w-lg mx-auto">
                <div>
                    <Label htmlFor="main-goal" className="font-semibold text-lg text-black">What is one goal you want to focus on?</Label>
                    <Input id="main-goal" value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} placeholder="e.g., Practice one mindful moment" className="bg-white text-black" />
                </div>
                <div>
                    <Label className="font-semibold text-lg text-black">Break it down (optional)</Label>
                    <div className="space-y-2">
                        {subGoals.map((goal, i) => (
                           <Input key={i} value={goal} onChange={(e) => handleSubGoalChange(i, e.target.value)} placeholder={`Sub-goal ${i+1}`} className="bg-white text-black" />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label className="font-semibold text-black">Time Focus</Label>
                        <RadioGroup value={goalTime} onValueChange={setGoalTime} className="mt-2">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Daily" id="daily" /><Label htmlFor="daily" className="text-black">Daily</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Weekly" id="weekly" /><Label htmlFor="weekly" className="text-black">Weekly</Label></div>
                        </RadioGroup>
                    </div>
                     <div>
                        <Label className="font-semibold text-black">When feeling...</Label>
                        <RadioGroup value={goalMood} onValueChange={setGoalMood} className="mt-2">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Anxious" id="anxious" /><Label htmlFor="anxious" className="text-black">Anxious</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Sad" id="sad" /><Label htmlFor="sad" className="text-black">Sad</Label></div>
                        </RadioGroup>
                    </div>
                </div>

                <Button onClick={handleSaveGoal} className="w-full" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Goal'}
                </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
   const TabButton = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex-1 py-3 px-4 text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2",
        activeTab === id
          ? "bg-white text-indigo-700 rounded-t-lg shadow-inner"
          : "text-gray-600 hover:bg-white/50"
      )}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8 flex items-center justify-center pt-24">
        <style>{`
            @keyframes inhale {
                from { transform: scale(1); }
                to { transform: scale(1.2); }
            }
            @keyframes exhale {
                from { transform: scale(1.2); }
                to { transform: scale(1); }
            }
        `}</style>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200">
        <div className="flex bg-gray-100 rounded-t-lg border-b border-gray-200">
            <TabButton id="breathing" label="Breathing" icon={<Wind className="h-5 w-5" />} />
            <TabButton id="affirmations" label="Affirmations" icon={<Sparkles className="h-5 w-5" />} />
            <TabButton id="goal-setting" label="Goal Setting" icon={<Target className="h-5 w-5" />} />
        </div>
        <div className="p-4 sm:p-8">{renderContent()}</div>
      </div>
    </div>
  );
}
