'use client';

import { Separator } from '@/components/ui/separator';

type DisclaimerData = {
  main_disclaimer: string;
  copyright_text: string;
};

export function DisclaimerSection({ data }: { data: DisclaimerData }) {
  return (
    <footer className="w-full py-12 bg-accent animate-in fade-in-0 slide-in-from-bottom-5 duration-1000">
      <div className="container mx-auto px-4 md:px-6">
        <Separator className="mb-8 bg-accent-foreground/20" />
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="max-w-3xl text-xs text-accent-foreground/90">
            {data.main_disclaimer}
          </p>
          <p className="text-xs text-accent-foreground/90">
            {data.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  );
}
