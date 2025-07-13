
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const counsellors = [
  {
    id: 'dr_ananya_banerjee',
    name: 'Dr. Ananya Banerjee',
    specialty: 'Emotional Resilience, Trauma Recovery',
    description: "Hello dear, I’m Dr. Ananya. Life can be overwhelming, but you're not alone. Let's walk through your thoughts gently, and I’ll help you find peace, clarity, and self-compassion.",
    imageUrl: 'https://placehold.co/400x300.png',
    link: '/care-circle/dr-ananya-banerjee',
    age: 50,
    gender: 'Female',
  },
  {
    id: 'kabir_islam',
    name: 'Kabir Islam',
    specialty: 'Stress & Anxiety Management, Career Pressure',
    description: "Hey, I’m Kabir. Let’s be practical—your mind is powerful, and so are you. I’ll help you cut through confusion and take control, one clear step at a time.",
    imageUrl: 'https://placehold.co/400x300.png',
    link: '/care-circle/kabir-islam',
    age: 40,
    gender: 'Male',
  },
  {
    id: 'rishi_bhattacharyya',
    name: 'Rishi Bhattacharyya',
    specialty: 'Inner Healing, Purpose Discovery',
    description: "Namaste, I am Rishi. Together, we’ll explore your story—through mindful pauses and the quiet truths of life. The journey within is the most meaningful one.",
    imageUrl: 'https://placehold.co/400x300.png',
    link: '/care-circle/rishi-bhattacharyya',
    age: 65,
    gender: 'Male',
  },
  {
    id: 'zoya',
    name: 'Zoya',
    specialty: 'Mood Tracking, Journaling',
    description: "Hey, it’s Zoya! Think of me like your chill buddy who checks in on your vibes and shares little pick-me-ups. Let’s talk it out, laugh a bit, and grow together.",
    imageUrl: 'https://placehold.co/400x300.png',
    link: '/care-circle/zoya',
    age: 30,
    gender: 'Female',
  },
  {
    id: 'vikram',
    name: 'Vikram',
    specialty: 'Motivation, Confidence, Breakup Recovery',
    description: "Yo! Vikram here. Let’s kick doubt out and bring your power back. Whether it’s heartbreak, burnout, or chaos—we’ll face it with grit and a grin.",
    imageUrl: 'https://placehold.co/400x300.png',
    link: '/care-circle/vikram',
    age: 35,
    gender: 'Male',
  },
  {
    id: 'dr_tara_mehta',
    name: 'Dr. Tara Mehta',
    specialty: 'Cognitive Behavioral Support, Decision Clarity',
    description: "Hi, I’m Dr. Tara. Let’s unpack your thoughts together with care and logic. I’m here to help you make sense of what you’re feeling, and where it’s leading.",
    imageUrl: 'https://placehold.co/400x300.png',
    link: '/care-circle/dr-tara-mehta',
    age: 45,
    gender: 'Female',
  },
];


export default function CareCirclePage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-teal-50 to-white p-4 sm:p-8 pt-24">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Meet Your Care Circle</h1>
                <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                    Our diverse team of AI counsellors is here to support you. Each offers a unique approach to help you navigate your journey.
                </p>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {counsellors.map(counsellor => (
                    <Card key={counsellor.id} className="flex flex-col text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl bg-white">
                        <CardHeader className="p-0">
                           <Image 
                             src={counsellor.imageUrl}
                             alt={`Photo of ${counsellor.name}`}
                             width={400}
                             height={300}
                             className="w-full h-auto object-cover"
                             data-ai-hint="portrait professional"
                           />
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                            <CardTitle className="text-2xl font-bold text-gray-900">{counsellor.name}</CardTitle>
                            <p className="text-md font-semibold text-teal-600 mt-1">{counsellor.specialty}</p>
                            <CardDescription className="mt-4 text-gray-700">{counsellor.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="p-6 bg-gray-50 flex justify-center">
                            <Button asChild className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3">
                                <Link href="#">Talk to me</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </main>
        </div>
    )
}
