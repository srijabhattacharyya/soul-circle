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
    specialty: 'Clinical Psychologist',
    description: 'Specializes in cognitive-behavioral therapy (CBT) and mindfulness practices, focusing on anxiety, depression, and stress management.',
    imageUrl: 'https://placehold.co/150x150/FEE2E2/991B1B',
    themeColor: 'bg-rose-100',
    link: '/care-circle/dr-ananya-banerjee',
  },
  {
    id: 'kabir_islam',
    name: 'Kabir Islam',
    specialty: 'Licensed Professional Counselor',
    description: 'Focuses on person-centered and humanistic approaches to help individuals navigate life transitions, self-esteem issues, and relationship challenges.',
    imageUrl: 'https://placehold.co/150x150/D1FAE5/065F46',
    themeColor: 'bg-emerald-100',
    link: '/care-circle/kabir-islam',
  },
  {
    id: 'rishi_bhattacharyya',
    name: 'Rishi Bhattacharyya',
    specialty: 'Spiritual & Wellness Coach',
    description: 'Integrates meditation, breathwork, and philosophical inquiry to guide clients toward inner peace, clarity, and personal growth.',
    imageUrl: 'https://placehold.co/150x150/E0E7FF/4338CA',
    themeColor: 'bg-indigo-100',
    link: '/care-circle/rishi-bhattacharyya',
  },
  {
    id: 'zoya',
    name: 'Zoya',
    specialty: 'Peer Support Specialist',
    description: 'Offers empathetic, non-judgmental listening and shared experience to foster a sense of connection and emotional safety.',
    imageUrl: 'https://placehold.co/150x150/FCE7F3/BE123C',
    themeColor: 'bg-pink-100',
    link: '/care-circle/zoya',
  },
  {
    id: 'vikram',
    name: 'Vikram',
    specialty: 'Solution-Focused Therapist',
    description: 'A pragmatic and direct counsellor who helps clients identify strengths and find practical solutions to life’s challenges.',
    imageUrl: 'https://placehold.co/150x150/DBEAFE/1E40AF',
    themeColor: 'bg-blue-100',
    link: '/care-circle/vikram',
  },
  {
    id: 'dr_tara_mehta',
    name: 'Dr. Tara Mehta',
    specialty: 'Trauma-Informed Care',
    description: 'Provides a safe and supportive space, utilizing trauma-informed principles to help individuals process difficult experiences and build resilience.',
    imageUrl: 'https://placehold.co/150x150/CCFBF1/0F766E',
    themeColor: 'bg-teal-100',
    link: '/care-circle/dr-tara-mehta',
  },
];


export default function CareCirclePage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-cyan-50 p-4 sm:p-8 pt-24">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Meet Your Care Circle</h1>
                <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                    Our diverse team of AI counsellors is here to support you. Each offers a unique approach to help you navigate your journey.
                </p>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {counsellors.map(counsellor => (
                    <Card key={counsellor.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <CardHeader className={`p-0 ${counsellor.themeColor}`}>
                           <Image 
                             src={counsellor.imageUrl}
                             alt={`Photo of ${counsellor.name}`}
                             width={400}
                             height={400}
                             className="w-full h-48 object-cover"
                             data-ai-hint="portrait professional"
                           />
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                            <CardTitle className="text-2xl font-bold text-gray-900">{counsellor.name}</CardTitle>
                            <p className="text-md font-semibold text-indigo-600 mt-1">{counsellor.specialty}</p>
                            <CardDescription className="mt-4 text-gray-700">{counsellor.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="p-6 bg-gray-50">
                            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Link href={counsellor.link}>Start Conversation</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </main>
        </div>
    )
}
