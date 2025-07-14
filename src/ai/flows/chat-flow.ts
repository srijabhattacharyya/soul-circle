
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

const ChatInputSchema = z.object({
  persona: z
    .string()
    .describe(
      "The system prompt defining the AI counsellor's personality and instructions."
    ),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .describe('The history of the conversation.'),
  message: z.string().describe('The latest message from the user.'),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = { response: string };

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI counsellor's response."),
});

export async function chatWithCounsellor(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: z.string().describe("The AI counsellor's response.") },
  system: `System Instruction: You must follow this persona: {{{persona}}}

  Your goal is to be a supportive and empathetic listener. You are not a licensed therapist, but a caring companion.
  Guide the conversation naturally. Do not give direct advice, but help the user explore their feelings through reflective questions.
  Keep your responses conversational and not too long.
  `,
  messages: [
    { role: 'user', content: "Understood. I will follow my persona instructions and engage in a supportive conversation." },
    { role: 'model', content: "Okay, I am ready." },
    ...ChatInputSchema.shape.history.parse([]).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
    })),
    { role: 'user', content: '{{{message}}}' },
  ],
  config: {
    model: 'googleai/gemini-pro',
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
    ]
  },
  
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    
    // We need to create a temporary history that includes the new message to pass to the prompt
    const fullHistory = [
      ...input.history,
      { role: 'user' as const, content: input.message },
    ];
    
    const { output } = await ai.generate({
        model: 'googleai/gemini-pro',
        prompt: input.message,
        history: input.history.map(m => ({role: m.role, content: m.content})),
        system: `System Instruction: You must follow this persona: ${input.persona}\n\nYour goal is to be a supportive and empathetic listener. You are not a licensed therapist, but a caring companion.\nGuide the conversation naturally. Do not give direct advice, but help the user explore their feelings through reflective questions.\nKeep your responses conversational and not too long.`
    });

    if (!output || typeof output !== 'string') {
        const safetyFeedback = (output as any)?.usage?.safety?.feedback;
        if(safetyFeedback){
            console.error("Safety block detected in chat flow", safetyFeedback);
            return { response: "I'm sorry, I cannot respond to that. The topic is outside my ability to discuss safely." };
        }
      return { response: 'Sorry, I couldn’t understand that. Please try again.' };
    }

    return { response: output };
  }
);
