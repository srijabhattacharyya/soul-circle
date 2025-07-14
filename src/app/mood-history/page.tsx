
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { getMoodHistory, type MoodEntry } from '@/lib/firebase/service';
import { Loader2, Calendar, Smile, Meh, Frown, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const moodIcons: { [key: number]: React.ReactNode } = {
  1: <Frown className="h-6 w-6 text-red-500" />,
  2: <Frown className="h-6 w-6 text-orange-500" />,
  3: <Meh className="h-6 w-6 text-yellow-500" />,
  4: <Smile className="h-6 w-6 text-green-500" />,
  5: <Smile className="h-6 w-6 text-teal-500" />,
};

export default function MoodHistoryPage() {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError(null);
      getMoodHistory(user.uid)
        .then(data => {
          // Sort data by date descending, as we removed it from the query
          const sortedData = data.sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());
          setMoodData(sortedData);
        })
        .catch(err => {
          console.error(err);
          // Firestore index errors are the most common cause.
          // The console log from Firebase will contain a direct link to create it.
           setError("Could not load mood history. This is often due to a missing database index. Please check your browser's developer console for an error message from Firestore, which may contain a link to create the required index.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  const chartData = moodData
    .map(entry => ({
      name: format(entry.date.toDate(), 'MMM d'),
      mood: entry.moodRating,
      stress: entry.stressLevel,
    }))
    .reverse();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cyan-50 to-blue-50 p-4 sm:p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Your Mood History</h1>
          <p className="text-lg text-gray-600 mt-4">
            Reflect on your emotional journey and discover your patterns over time.
          </p>
        </header>

         {error && (
            <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {!error && moodData.length > 0 ? (
          <div className="space-y-12">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle>Mood & Stress Levels Over Time</CardTitle>
                <CardDescription>A visual look at your check-ins.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}/>
                    <Legend />
                    <Bar dataKey="mood" fill="#8884d8" name="Mood Rating (1-5)" />
                    <Bar dataKey="stress" fill="#82ca9d" name="Stress Level (1-10)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle>Detailed Log</CardTitle>
                    <CardDescription>A complete record of your mood check-ins.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead className="text-center">Mood</TableHead>
                                <TableHead className="text-center">Stress</TableHead>
                                <TableHead>Emotions</TableHead>
                                <TableHead>Influences</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {moodData.map(entry => (
                                <TableRow key={entry.id}>
                                    <TableCell className="font-medium">{format(entry.date.toDate(), 'PPP')}</TableCell>
                                    <TableCell className="flex justify-center">{moodIcons[entry.moodRating]}</TableCell>
                                    <TableCell className="text-center">{entry.stressLevel}</TableCell>
                                    <TableCell>{entry.emotions?.join(', ') || 'N/A'}</TableCell>
                                    <TableCell>{entry.influences?.join(', ') || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </div>
        ) : (
          !error && (
            <Card className="text-center p-12 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-6 text-xl font-semibold text-gray-800">No Mood History Found</h2>
              <p className="mt-2 text-gray-500">
                Start logging your daily mood using the "Inner Weather" tool to see your history here.
              </p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
