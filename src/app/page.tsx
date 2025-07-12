import { HeroSection } from '@/components/landing/hero-section';
import { HowItHelpsSection } from '@/components/landing/how-it-helps-section';
import { DisclaimerSection } from '@/components/landing/disclaimer-section';
import { landingPageData } from '@/lib/mock-data';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1">
        <HeroSection data={landingPageData.hero_section} />
        <HowItHelpsSection data={landingPageData.how_it_helps_section} />
      </main>
      <DisclaimerSection data={landingPageData.disclaimer_section} />
    </div>
  );
}
