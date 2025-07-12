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
    <section className="w-full py-20 md:py-32 animate-in fade-in-0 slide-in-from-bottom-5 duration-1000">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/images/logo.png"
                alt="SoulCircle Logo"
                width={96}
                height={96}
                className="h-24 w-24"
                data-ai-hint="logo"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              {data.catch_line}
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl lg:mx-0 mx-auto">
              {data.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
              <Button size="lg">{data.button_get_started_label}</Button>
              <Button size="lg" variant="outline">
                {data.button_learn_more_label}
              </Button>
            </div>
          </div>
          <Image
            src="https://placehold.co/600x600.png"
            data-ai-hint="Indian woman"
            alt="A smiling woman"
            width={600}
            height={600}
            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
