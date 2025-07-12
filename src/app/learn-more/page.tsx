import Image from 'next/image';

export default function LearnMorePage() {
  return (
    <div className="flex flex-col min-h-dvh bg-secondary text-foreground">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-start">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Image
                  src="https://placehold.co/400x300.png"
                  alt="Founder's Photo"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                  data-ai-hint="portrait founder"
                />
                <div className="pt-4 text-muted-foreground text-sm text-center">
                  <p className="font-semibold">By Srija Bhattacharyya</p>
                  <p>3rd Year Student, B.Tech CSE</p>
                  <p>
                    Kalinga Institute of Industrial Technology (KIIT),
                    Bhubaneswar
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-left">
                  During my years of hostel life, I have had countless
                  late-night conversations with friends battling emotional
                  stress, anxiety, and depression—often in silence. Many of
                  them, including myself, have felt the pressing need to talk
                  to someone who could simply listen, offer thoughtful advice,
                  or help navigate a tough moment—especially during exam time
                  or periods of academic pressure.
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-left">
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

        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <div className="container px-4 md:px-6 space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                ⚠️ Important Disclaimer
              </h2>
              <p className="text-muted-foreground">
                SoulCircle is a supportive tool for emotional well-being and is
                not a crisis support service or a substitute for professional
                therapy, medical treatment, or psychiatric care. The AI
                counsellors are advanced language models, not licensed
                therapists. The guidance provided is for informational and
                emotional support purposes only.
              </p>
              <p className="text-muted-foreground font-semibold">
                If you are in a mental health crisis or have thoughts of
                self-harm or harming others, please contact a qualified mental
                health professional or reach out to your local emergency
                services or a crisis helpline immediately.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                🔐 Data Privacy & Security
              </h2>
              <p className="text-muted-foreground">
                We deeply value your trust and are committed to protecting your
                personal information. SoulCircle uses Firebase Authentication
                and Firestore to securely store user data with industry-standard
                encryption, secure access protocols, and role-based
                permissions. Your conversations, journal entries, and profile
                information are private and accessible only to you, unless you
                explicitly choose to share them. We do not sell, trade, or
                misuse your data.
              </p>
              <p className="text-muted-foreground">
                You are always in control—you may delete your data or revoke
                permissions at any time.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                🛠️ Tech Stack Used
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Frontend: Next.js 14+, Tailwind CSS</li>
                <li>
                  Backend: Firebase (Authentication, Firestore, Cloud
                  Functions)
                </li>
                <li>
                  AI Integration: Gemini API for persona-based counseling
                  conversations
                </li>
                <li>
                  Storage: Firebase Storage (for media uploads and journal
                  data)
                </li>
                <li>
                  Analytics: Firebase Analytics or PostHog (to improve user
                  experience)
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                🧠 AI & Future Learning
              </h2>
              <p className="text-muted-foreground">
                This version of SoulCircle is a prototype, but it lays the
                foundation for what could evolve into a highly personalized
                emotional wellness platform. Like all AI systems, these models
                improve over time—especially through interaction, learning from
                real-life use cases, and user feedback. With thoughtful use and
                continuous training on ethical, anonymized data, the AI
                counsellors will become more intuitive and emotionally
                responsive.
              </p>
              <p className="text-muted-foreground">
                All personas and counsellor photos are AI-generated, unless
                otherwise stated. Only my personal image is real and provided
                with consent.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                🙏 Gratitude & Closing Note
              </h2>
              <p className="text-muted-foreground">
                I am sincerely grateful to OpenAI, Firebase Studio, and Canva
                AI for their powerful tools and platforms, which made this
                vision a reality. This project has been a labor of empathy,
                curiosity, and hope—rooted in the belief that no one should
                feel emotionally isolated.
              </p>
              <p className="text-muted-foreground">
                If SoulCircle brings comfort to even one person, then every
                moment spent building it has been worthwhile.
              </p>
            </div>

            <div className="text-center text-muted-foreground space-y-2 pt-8">
              <p>Thank you for visiting SoulCircle.</p>
              <p className="font-semibold">
                Because your story deserves a listening circle. 🫶
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}