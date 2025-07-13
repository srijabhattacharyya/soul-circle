
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

type HeroSectionData = {
  catch_line: string;
  tagline: string;
  button_get_started_label: string;
  button_learn_more_label: string;
};

export function HeroSection({ data }: { data: HeroSectionData }) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-900 text-primary-foreground animate-in fade-in-0 slide-in-from-bottom-5 duration-1000">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="flex justify-center">
              <Image
                src="/images/logo.png"
                alt="SoulCircle Logo"
                width={128}
                height={128}
                quality={100}
                className="h-24 w-24 md:h-32 md:w-32"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
              {data.catch_line}
            </h1>
            <p className="max-w-[700px] text-primary-foreground/90 mx-auto text-base leading-relaxed sm:text-lg">
              {data.tagline}
            </p>
            <div className="w-full max-w-sm mx-auto flex flex-col sm:flex-row gap-2">
              <Button asChild className='bg-accent text-accent-foreground hover:bg-accent/90 transition-colors w-full h-10 px-4 py-2 md:h-11 md:px-8'><Link href="#">{data.button_get_started_label}</Link></Button>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors w-full h-10 px-4 py-2 md:h-11 md:px-8">
                <Link href="/learn-more">{data.button_learn_more_label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
