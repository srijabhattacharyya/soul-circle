import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-16 bg-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="h-20" aria-hidden="true" /> {/* Logo whitespace */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your Safe Space for Mental Wellness
            </h1>
            <div className="mt-8 flex justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
