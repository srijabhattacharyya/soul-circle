
'use client';

import { useAuth } from '@/components/auth-provider';
import { DisclaimerSection } from '@/components/landing/disclaimer-section';
import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItHelpsSection } from '@/components/landing/how-it-helps-section';
import { Dashboard } from '@/components/dashboard/page';

const MOCK_DATA = {
  hero_section: {
    logo_placeholder_text: "96x96",
    catch_line: "Because your story deserves a listening circle.",
    tagline: "Your emotions matter. Talk to AI counsellors, made to understand the heart.",
    button_get_started_label: "Get Started",
    button_learn_more_label: "Learn More",
  },
  how_it_helps_section: {
    title: "How SoulCircle Helps You",
    boxes: [
      {
        heading: "Understand Your Well-being",
        content: "Gain insights into your emotional state with confidential assessments.",
        icon: "BrainCircuit",
      },
      {
        heading: "Track Your Progress",
        content: "Monitor changes in your mood and emotional patterns over time.",
        icon: "LineChart",
      },
      {
        heading: "Connect with Support",
        content: "Access culturally sensitive resources and AI-driven counselling.",
        icon: "Users",
      },
      {
        heading: "Early Intervention Focus",
        content: "Address concerns proactively and reduce mental health stigma.",
        icon: "ShieldCheck",
      },
    ],
  },
  disclaimer_section: {
    main_disclaimer:
      "Disclaimer: SoulCircle provides emotional well-being support and insights. It is not a substitute for professional medical advice, diagnosis, or treatment. If you are in crisis or experiencing severe distress, please seek immediate professional help.",
    copyright_text: "© 2025 SoulCircle. All rights reserved.",
  },
};

export default function Home() {
  const { user } = useAuth();

  const content = MOCK_DATA;

  if (user) {
    return <Dashboard />;
  }

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
