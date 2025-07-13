'use client';

import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookHeart, CloudSun, HeartHandshake, Zap, BarChart, Notebook, Star } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Your Care Circle',
    description: 'Connect with an AI counsellor who fits your needs.',
    icon: <HeartHandshake className="h-8 w-8 text-rose-400" />,
    link: '/care-circle',
    color: 'bg-rose-50',
  },
  {
    title: 'Inner Weather',
    description: 'Log your daily mood and understand your emotional patterns.',
    icon: <CloudSun className="h-8 w-8 text-cyan-400" />,
    link: '/inner-weather',
    color: 'bg-cyan-50',
  },
  {
    title: 'Mind Haven',
    description: 'A private and safe space for your journal entries.',
    icon: <BookHeart className="h-8 w-8 text-purple-400" />,
    link: '/mind-haven',
    color: 'bg-purple-50',
  },
  {
    title: 'Soothe Studio',
    description: 'Tools for breathing, affirmations, and goal-setting.',
    icon: <Zap className="h-8 w-8 text-amber-400" />,
    link: '/soothe-studio',
    color: 'bg-amber-50',
  },
];

const quickAccess = [
    { title: "View Mood History", icon: <BarChart className="mr-2 h-4 w-4" />, link: "/mood-history"},
    { title: "My Journal Entries", icon: <Notebook className="mr-2 h-4 w-4" />, link: "/journal-history"},
    { title: "Saved Items", icon: <Star className="mr-2 h-4 w-4" />, link: "/saved-items"},
]

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-rose-50 p-4 sm:p-8 pt-24">
      <header className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
          Welcome back, {user?.displayName?.split(' ')[0] || 'friend'}
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Ready to continue your journey? Here are your tools.
        </p>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.link} className="block hover:scale-[1.03] transition-transform duration-300">
              <Card className={`h-full flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl ${feature.color}`}>
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <Card className="mt-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border-gray-200">
            <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Jump right back in where you left off.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    {quickAccess.map(item => (
                        <Button key={item.title} asChild variant="outline" className="bg-white">
                            <Link href={item.link}>
                                {item.icon}
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
