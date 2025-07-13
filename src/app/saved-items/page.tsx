
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { getSavedAffirmations, getSavedGoals, type SavedAffirmation, type SavedGoal } from '@/lib/firebase/service';
import { Loader2, Star, Target, CheckCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { toggleGoalCompletion, deleteSavedAffirmation } from '@/lib/firebase/service';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function SavedItemsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [affirmations, setAffirmations] = useState<SavedAffirmation[]>([]);
  const [goals, setGoals] = useState<SavedGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (user) {
        setIsLoading(true);
        try {
            const [affirmationsData, goalsData] = await Promise.all([
                getSavedAffirmations(user.uid),
                getSavedGoals(user.uid)
            ]);
            setAffirmations(affirmationsData);
            setGoals(goalsData);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Could not load saved items.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleToggleGoal = async (goalId: string, currentStatus: boolean) => {
    const originalGoals = [...goals];
    const updatedGoals = goals.map(g => g.id === goalId ? {...g, completed: !currentStatus} : g);
    setGoals(updatedGoals);

    try {
        await toggleGoalCompletion(goalId, !currentStatus);
        toast({ title: "Success", description: `Goal marked as ${!currentStatus ? 'complete' : 'incomplete'}.`});
    } catch (error) {
        setGoals(originalGoals);
        toast({ title: "Error", description: "Could not update goal.", variant: "destructive" });
    }
  }

  const handleDeleteAffirmation = async (affirmationId: string) => {
    const originalAffirmations = [...affirmations];
    const updatedAffirmations = affirmations.filter(a => a.id !== affirmationId);
    setAffirmations(updatedAffirmations);
    
    try {
        await deleteSavedAffirmation(affirmationId);
        toast({ title: "Success", description: "Affirmation removed."});
    } catch (error) {
        setAffirmations(originalAffirmations);
        toast({ title: "Error", description: "Could not remove affirmation.", variant: "destructive" });
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Your Saved Items</h1>
          <p className="text-lg text-gray-600 mt-4">
            A collection of your favorite affirmations and personal goals.
          </p>
        </header>

        <Tabs defaultValue="affirmations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="affirmations"><Star className="mr-2" />Saved Affirmations</TabsTrigger>
            <TabsTrigger value="goals"><Target className="mr-2" />Mindful Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="affirmations">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle>Your Affirmations</CardTitle>
                <CardDescription>Statements of strength and positivity you've collected.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {affirmations.length > 0 ? (
                  affirmations.map(item => (
                    <div key={item.id} className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg flex justify-between items-center">
                      <p className="italic">"{item.affirmation}"</p>
                       <Button variant="ghost" size="icon" onClick={() => handleDeleteAffirmation(item.id)}>
                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                       </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">You haven't saved any affirmations yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="goals">
             <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle>Your Goals</CardTitle>
                <CardDescription>Your intentions for well-being and growth.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.length > 0 ? (
                  goals.map(goal => (
                    <Card key={goal.id} className={cn("p-4 transition-colors", goal.completed ? 'bg-green-50 border-green-200' : 'bg-white')}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={cn("font-bold text-lg", goal.completed && "line-through text-gray-500")}>{goal.mainGoal}</p>
                                <div className="text-sm text-gray-500 space-x-2">
                                    <span>Added: {format(goal.createdAt.toDate(), 'PP')}</span>
                                    <span>•</span>
                                    <span>When {goal.moodFocus}</span>
                                    <span>•</span>
                                    <span>{goal.timeFocus}</span>
                                </div>
                                {goal.subGoals && goal.subGoals.length > 0 && (
                                    <ul className="list-disc pl-5 mt-2 text-gray-700">
                                        {goal.subGoals.map((sg, i) => <li key={i}>{sg}</li>)}
                                    </ul>
                                )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleToggleGoal(goal.id, goal.completed)}>
                                <CheckCircle className={cn("h-6 w-6", goal.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-400')} />
                            </Button>
                        </div>
                    </Card>
                  ))
                ) : (
                   <p className="text-gray-500 text-center py-8">You haven't set any goals yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
