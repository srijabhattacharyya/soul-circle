
'use server';
/**
 * @fileOverview An AI flow for handling conversational chat with a persona.
 *
 * - chatWithCounsellor - A function that generates a response from an AI counsellor.
 * - ChatInput - The input type for the chatWithCounsellor function.
 * - ChatOutput - The return type for the chatWithCounsellor function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getMessages } from '@/lib/firebase/service';
import type { ChatMessage } from '@/components/chat-room';

const ChatInputSchema = z.object({
  persona: z
    .string()
    .describe(
      "The system prompt defining the AI counsellor's personality and instructions."
    ),
  message: z.string().describe('The latest message from the user.'),
  userId: z.string().describe('The user ID for the chat.'),
  counsellorId: z.string().describe('The counsellor ID for the chat.'),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = { response: string };

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI counsellor's response."),
});


export async function chatWithCounsellor(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}


const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    
    // Fetch the most recent history directly from Firestore
    const history = await getMessages(input.userId, input.counsellorId, 10);
    
    const { output } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: input.message,
        history: history.map(m => ({role: m.role, content: m.content})),
        system: `System Instruction: You must follow this persona: ${input.persona}\n\nYour goal is to be a supportive and empathetic listener. You are not a licensed therapist, but a caring companion.\nGuide the conversation naturally. Do not give direct advice, but help the user explore their feelings through reflective questions.\nKeep your responses conversational and not too long.`
    });

    const responseText = (output as any)?.text;

    if (!responseText) {
        const safetyFeedback = (output as any)?.usage?.safety?.feedback;
        if(safetyFeedback){
            console.error("Safety block detected in chat flow", safetyFeedback);
            return { response: "I'm sorry, I cannot respond to that. The topic is outside my ability to discuss safely." };
        }
      return { response: 'Sorry, I couldn’t understand that. Please try again.' };
    }

    return { response: responseText };
  }
);

