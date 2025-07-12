import {
  DisclaimerSection,
} from '@/components/landing/disclaimer-section';
import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import {
  HowItHelpsSection,
} from '@/components/landing/how-it-helps-section';
import { getLandingPageContent } from '@/lib/content-service';

export default async function Home() {
  const content = await getLandingPageContent();
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection data={content.hero_section} />
        <HowItHelpsSection data={content.how_it_helps_section} />
      </main>
      <DisclaimerSection data={content.disclaimer_section} />
    </div>
  );
}
