import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function LearnMorePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-secondary">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
              <div className="flex justify-center">
                <Image
                  src="https://placehold.co/400x400.png"
                  width="400"
                  height="400"
                  alt="Srija"
                  className="rounded-lg shadow-lg"
                  data-ai-hint="founder portrait"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  During my years of hostel life, I have had countless
                  late-night conversations with friends battling emotional
                  stress, anxiety, and depression—often in silence. Many of
                  them, including myself, have felt the pressing need to talk
                  to someone who could simply listen, offer thoughtful advice,
                  or help navigate a tough moment—especially during exam time
                  or periods of academic pressure.
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  In our hectic schedules, reaching out to a professional
                  counsellor isn’t always possible. This realization gave
                  birth to SoulCircle—an AI-powered mental wellness companion
                  that offers a non-judgmental, empathetic space to talk,
                  reflect, and feel heard—anytime, anywhere. The AI
                  counsellors in SoulCircle are available 24x7 to support
                  users through conversation, journaling, self-help tools, and
                  mood tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
