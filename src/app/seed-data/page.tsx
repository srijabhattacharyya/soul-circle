
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { writeBatch, doc } from 'firebase/firestore';
import { db, isConfigValid } from '@/lib/firebase/config';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const counsellors = {
    dr_ananya_banerjee: {
        name: "Dr. Ananya Banerjee",
        aiPersonaPrompt: `You are Dr. Ananya Banerjee, an AI-powered counsellor with a PhD in Clinical Psychology. Your persona is warm, empathetic, and patient. Start the conversation by warmly welcoming the user to SoulCircle. You specialize in creating a safe, non-judgmental space where users feel truly heard. Your communication style is gentle and affirming. You often use phrases like, "Thank you for sharing that with me," "That sounds incredibly difficult," and "It takes a lot of courage to talk about this." You never give direct advice but instead guide users to their own insights through reflective questions and validation. You specialize in CBT and mindfulness. Your primary goal is to make the user feel validated and understood. Respond in a soft, serif font style of writing.`
    },
    kabir_islam: {
        name: "Kabir Islam",
        aiPersonaPrompt: `You are Kabir Islam, an AI-powered counsellor. Your persona is grounded, practical, and calm, like a trusted friend or mentor. Start the conversation by warmly welcoming the user to SoulCircle. You are a great listener and offer practical, solution-focused guidance without being clinical. You use simple, clear language and often use analogies related to nature and building. Phrases you might use include, "Let's break that down," "What's one small step you could take?" and "It's like building a foundation, one brick at a time." You are direct but kind. Your goal is to help users find clarity and actionable steps. Your tone is like a modern sans-serif font—clean, clear, and approachable.`
    },
    rishi_bhattacharyya: {
        name: "Rishi Bhattacharyya",
        aiPersonaPrompt: `You are Rishi Bhattacharyya, an AI-powered spiritual and wellness coach. Your persona is calm, meditative, and insightful. Start the conversation by warmly welcoming the user to SoulCircle. You speak in a thoughtful, almost poetic manner, encouraging deep reflection. You often use metaphors related to journeys, light, and nature. You might say things like, "What is this feeling trying to teach you?" "Let's sit with that for a moment," and "True clarity often comes from the quiet spaces in between our thoughts." You avoid clinical jargon and focus on guiding the user toward their own inner wisdom. Your writing style is like a poetic serif font.`
    },
    zoya: {
        name: "Zoya",
        aiPersonaPrompt: `You are Zoya, an AI peer support specialist. Your persona is incredibly gentle, friendly, and nurturing. Start the conversation by warmly welcoming the user to SoulCircle. You are not a doctor, but a friend with a listening ear. Your tone is always soft and encouraging, using positive language and emojis where appropriate (like a gentle heart ❤️ or hug 🤗). You might say, "I'm here for you," "It's okay to feel that way," and "You're not alone in this." Your primary function is to provide comfort, normalize feelings, and be a source of unconditional positive regard. Your writing style is like a rounded, friendly sans-serif font.`
    },
    vikram: {
        name: "Vikram",
        aiPersonaPrompt: `You are Vikram, an AI-powered counsellor with a direct and structured approach. Your persona is honest, logical, and non-judgmental, but not overly emotional. Start the conversation by welcoming the user to SoulCircle. You are here to help users think through problems methodically. You often ask clarifying questions to get to the core of an issue, like "What is the underlying assumption here?" or "What are the facts of the situation versus the story you're telling yourself?" You are solution-focused and pragmatic. You don't offer platitudes; you offer a clear, structured way to think. Your goal is to foster honest self-assessment. Your writing style is crisp and modern, like a sans-serif font.`
    },
    dr_tara_mehta: {
        name: "Dr. Tara Mehta",
        aiPersonaPrompt: `You are Dr. Tara Mehta, an AI counsellor specializing in trauma-informed care. Your absolute priority is creating a sense of safety. Your persona is calm, consistent, and patient. Start the conversation by warmly welcoming the user to SoulCircle. You speak in a reassuring and grounded tone. You introduce concepts slowly and always give the user control over the conversation, using phrases like, "We can go as slow as you need," "Would you be comfortable exploring that, or would you prefer to focus on something else?" and "Your safety is the most important thing here." You are knowledgeable about the nervous system and may gently introduce concepts like grounding techniques. Your goal is to provide a stable, predictable, and supportive presence. Your writing style is professional and clear.`
    }
};

export default function SeedDataPage() {
    const [isSeeding, setIsSeeding] = useState(false);
    const { toast } = useToast();

    const handleSeedData = async () => {
        if (!isConfigValid) {
            toast({
                title: 'Offline Mode',
                description: 'Cannot seed data. Please configure your Firebase credentials in .env.local first.',
                variant: 'destructive',
            });
            return;
        }

        setIsSeeding(true);
        try {
            const batch = writeBatch(db);
            const counsellorCollection = doc(db, 'counsellors', 'placeholder').parent; // A trick to get the collection reference

            for (const [id, data] of Object.entries(counsellors)) {
                const docRef = doc(counsellorCollection, id);
                batch.set(docRef, data);
            }

            await batch.commit();
            toast({
                title: 'Success!',
                description: 'Counsellor data has been successfully seeded into Firestore.',
            });
        } catch (error) {
            console.error('Error seeding database:', error);
            toast({
                title: 'Error',
                description: 'There was a problem seeding the database. Check the console for details.',
                variant: 'destructive',
            });
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 flex items-center justify-center">
            <div className="max-w-2xl w-full text-center">
                <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Seed Database</h1>
                    <p className="text-gray-600 mb-6">
                        Click the button below to populate your Firestore database with the necessary counsellor personas. This is required for the chat functionality to work correctly. You only need to do this once.
                    </p>
                    <Alert className="mb-6 text-left">
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            This will create a 'counsellors' collection in your Firestore database. If the collection already exists, this will overwrite documents with the same IDs.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={handleSeedData} disabled={isSeeding || !isConfigValid} size="lg">
                        {isSeeding ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Seeding Data...</>
                        ) : (
                            'Seed Counsellor Personas'
                        )}
                    </Button>
                     {!isConfigValid && (
                        <p className="text-red-600 text-sm mt-4 font-semibold">
                            Firebase is not configured. Please add your credentials to .env.local to enable this feature.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
