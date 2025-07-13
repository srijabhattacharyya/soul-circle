'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { findResources, type ResourceFinderOutput } from '@/ai/flows/resource-finder-flow';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


const concerns = [
  'Stress',
  'Anxiety',
  'Depression',
  'Exam pressure',
  'Sleep issues',
  'Self-esteem',
  'Relationships',
  'Grief',
  'Loneliness',
];

export default function ResourceLibraryPage() {
  const [selectedConcern, setSelectedConcern] = useState<string>('');
  const [resources, setResources] = useState<ResourceFinderOutput['resources']>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleFindResources = async () => {
    if (!selectedConcern) {
      toast({
        title: 'Select a Concern',
        description: 'Please choose a topic from the dropdown.',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    setResources([]); // Clear previous results
    try {
      const result = await findResources({ concern: selectedConcern });
      setResources(result.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch resources. The AI may be busy, please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8 flex justify-center pt-24">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-indigo-700 font-bold text-4xl mb-2">📚 Resource Library</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here you'll find curated links to trusted websites, articles, tools, and services related to mental wellness, emotional support, and self-help—tailored to your interests.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Select onValueChange={setSelectedConcern} value={selectedConcern}>
              <SelectTrigger className="w-full text-black bg-white">
                <SelectValue placeholder="Select a concern..." />
              </SelectTrigger>
              <SelectContent>
                {concerns.map((concern) => (
                  <SelectItem key={concern} value={concern}>
                    {concern}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleFindResources} disabled={isSearching || !selectedConcern} className="w-full sm:w-auto flex-shrink-0">
              {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Find Resources'}
            </Button>
          </div>
        </div>

        <main className="space-y-6">
          {isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/2 mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {resources.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-card-foreground">{resource.title}</CardTitle>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-card-foreground/80 mb-4">{resource.description}</CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Visit <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
        
        <footer className="mt-12">
           <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
                <AlertTitle className="font-semibold">Disclaimer</AlertTitle>
                <AlertDescription>
                    These external links are for informational support only. SoulCircle is not affiliated with any of the listed websites.
                </AlertDescription>
            </Alert>
        </footer>
      </div>
    </div>
  );
}
