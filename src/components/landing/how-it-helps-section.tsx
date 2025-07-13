
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, LineChart, Users, ShieldCheck } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import * as React from 'react';

const icons: { [key: string]: React.ComponentType<LucideProps> } = {
  BrainCircuit,
  LineChart,
  Users,
  ShieldCheck,
};

type BoxData = {
  heading: string;
  content: string;
  icon: string;
};

type HowItHelpsData = {
  title: string;
  boxes: BoxData[];
};

export function HowItHelpsSection({ data }: { data: HowItHelpsData }) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background animate-in fade-in-0 slide-in-from-bottom-5 delay-200 duration-1000">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              {data.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-sm sm:max-w-4xl mx-auto">
            {data.boxes.map((box) => {
              const Icon = icons[box.icon];
              return (
                <Card
                  key={box.heading}
                  className="text-left flex flex-col hover:shadow-lg transition-shadow duration-300 border-black"
                >
                  <CardHeader>
                    {Icon && <Icon className="w-8 h-8 mb-2 text-primary" />}
                    <CardTitle className="font-headline text-lg">
                      {box.heading}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {box.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
