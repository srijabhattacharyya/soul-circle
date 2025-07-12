'use client';

import { Button } from '@/components/ui/button';

type HeroSectionData = {
  catch_line: string;
  tagline: string;
  button_get_started_label: string;
  button_learn_more_label: string;
};

export function HeroSection({ data }: { data: HeroSectionData }) {
  return (
    <section className="w-full py-20 md:py-32 animate-in fade-in-0 slide-in-from-bottom-5 duration-1000">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            {data.catch_line}
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            {data.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg">{data.button_get_started_label}</Button>
            <Button size="lg" variant="outline">
              {data.button_learn_more_label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
