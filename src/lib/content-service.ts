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

export async function getLandingPageContent() {
  // Returning mock data directly as a fallback.
  return MOCK_DATA;
}
