
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { getJournalHistory, type JournalEntry } from '@/lib/firebase/service';
import { Loader2, Notebook } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { format } from 'date-fns';

export default function JournalHistoryPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getJournalHistory(user.uid)
        .then(data => {
          setEntries(data);
        })
        .catch(error => console.error(error))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Your Journal Archive</h1>
          <p className="text-lg text-gray-600 mt-4">
            A safe space to revisit your thoughts, reflections, and moments of growth.
          </p>
        </header>

        {entries.length > 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6">
            <Accordion type="single" collapsible className="w-full">
              {entries.map(entry => (
                <AccordionItem key={entry.id} value={entry.id}>
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between w-full">
                      <span>{format(entry.timestamp.toDate(), 'MMMM d, yyyy - h:mm a')}</span>
                      {entry.moodTag && <span className="text-sm font-normal mr-4">{entry.moodTag}</span>}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {entry.entryText}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        ) : (
          <Card className="text-center p-12 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
            <Notebook className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-6 text-xl font-semibold text-gray-800">Your Journal is a Blank Canvas</h2>
            <p className="mt-2 text-gray-500">
              Use the "Mind Haven" tool to write your first entry. Your words will be saved here for you to look back on.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
