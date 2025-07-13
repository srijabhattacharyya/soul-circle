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

const prompt = ai.definePrompt({
  name: 'counsellorChatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  system: '{{{persona}}}',
  messages: [
    ...('{{{history}}}' as any),
    { role: 'user', content: '{{{message}}}' }
  ],
  output: {
    format: 'json',
    schema: z.object({ response: z.string() })
  },
  config: {
    temperature: 0.8,
  }
});


const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
