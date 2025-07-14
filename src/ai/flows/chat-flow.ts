
'use server';
/**
 * @fileOverview An AI flow for handling conversational chat with a persona.
 *
 * - chatWithCounsellor - A function that generates a response from an AI counsellor.
 * - ChatInput - The input type for the chatWithCounsellor function.
 * - ChatOutput - The return type for the chatWithCounsellor function.
 */

import { z } from 'zod';

const ChatInputSchema = z.object({
  persona: z.string().describe('The system prompt defining the AI counsellor\'s personality and instructions.'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ).describe('The history of the conversation.'),
  message: z.string().describe('The latest message from the user.'),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = { response: string };


export async function chatWithCounsellor(input: ChatInput): Promise<ChatOutput> {
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is missing from environment variables.');
  }
  
  // The Gemini API expects a conversation history where the first message from the user sets the persona/context.
  // The official roles are 'user' and 'model'.
  // We'll prepend the persona as the first 'user' message in a new conversation turn.
  // Then we add the existing history, and finally the new user message.
  const conversation = [
    // Persona setup turn
    {
      role: 'user',
      parts: [{ text: `System Instruction: You must follow this persona: ${input.persona}` }],
    },
    {
      role: 'model',
      parts: [{ text: "Understood. I will follow my persona instructions." }],
    },
    // Map existing history
    ...input.history.map((msg) => ({
      // Gemini's roles are 'user' and 'model'. We map our roles to theirs.
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    // Add the latest user message
    {
      role: 'user',
      parts: [{ text: input.message }],
    },
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: conversation,
        }),
      }
    );

    if (!res.ok) {
        const errorBody = await res.json();
        console.error('Gemini API Error:', errorBody);
        throw new Error(`Gemini API responded with status: ${res.status}`);
    }

    const data = await res.json();
    
    // Check for safety blocks
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].finishReason === 'SAFETY') {
        return { response: "I'm sorry, I cannot respond to that. The topic is outside my ability to discuss safely." };
    }

    const responseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn’t understand that. Please try again.';

    return { response: responseText };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Something went wrong while connecting to the AI counselor.');
  }
}
