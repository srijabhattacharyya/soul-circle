import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function LearnMorePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="h-20" />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Safe Space for Mental Wellness
              </h1>
              <div className="flex flex-col gap-2 min-[400px]:flex-row shadow-soft rounded-lg">
                <Button asChild size="lg">
                  <Link href="#">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#">Read More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center">
              {/* Content for the section below the hero can go here */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
