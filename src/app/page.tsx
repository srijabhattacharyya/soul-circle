import { HeroSection } from '@/components/landing/hero-section';
import { HowItHelpsSection } from '@/components/landing/how-it-helps-section';
import { DisclaimerSection } from '@/components/landing/disclaimer-section';
import { getLandingPageContent } from '@/lib/content-service';

export default async function Home() {
  const landingPageData = await getLandingPageContent();

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1 pt-16">
        <HeroSection data={landingPageData.hero_section} />
        <HowItHelpsSection data={landingPageData.how_it_helps_section} />
      </main>
      <DisclaimerSection data={landingPageData.disclaimer_section} />
    </div>
  );
}
