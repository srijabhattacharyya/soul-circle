
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
import type {Message} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  persona: z.string().describe('The system prompt defining the AI counsellor\'s personality and instructions.'),
  history: z.array(MessageSchema).describe('The history of the conversation.'),
  message: z.string().describe('The latest message from the user.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI counsellor\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chatWithCounsellor(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ persona, history, message }) => {
    
    const messages: Message[] = [
        ...history.map((msg) => ({
            role: msg.role,
            content: [{ text: msg.content }],
        })),
        {
            role: 'user',
            content: [{ text: message }],
        },
    ];

    const llmResponse = await ai.generate({
      system: persona,
      messages: messages,
      config: {
        temperature: 0.8,
      },
    });

    const responseText = llmResponse.text;
    if (!responseText) {
        throw new Error("AI failed to generate a valid response.");
    }

    return { response: responseText };
  }
);
