
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

type HeroSectionData = {
  catch_line: string;
  tagline: string;
  button_get_started_label: string;
  button_learn_more_label: string;
};

export function HeroSection({ data }: { data: HeroSectionData }) {
  return (
    <section className="w-full py-20 md:py-32 animate-in fade-in-0 slide-in-from-bottom-5 duration-1000 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6 text-center">
            <div className="flex justify-center">
              <Image
                src="/images/logo.png"
                alt="SoulCircle Logo"
                width={128}
                height={128}
                quality={100}
                className="h-24 w-24 md:h-32 md:w-32"
                data-ai-hint="logo"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              {data.catch_line}
            </h1>
            <p className="max-w-[700px] text-primary-foreground/90 md:text-xl mx-auto">
              {data.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center">
              <Button size="lg" variant="ghost" className='bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground'>{data.button_get_started_label}</Button>
              <Button size="lg" variant="outline">
                {data.button_learn_more_label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
