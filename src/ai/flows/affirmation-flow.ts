'use server';
/**
 * @fileOverview An AI flow to generate affirmations based on a category.
 *
 * - generateAffirmations - A function that generates affirmations.
 * - AffirmationsInput - The input type for the generateAffirmations function.
 * - AffirmationsOutput - The return type for the generateAffirmations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AffirmationsInputSchema = z.object({
  category: z.string().describe('The category for which to generate affirmations (e.g., "Morning Boost", "Confidence").'),
});
export type AffirmationsInput = z.infer<typeof AffirmationsInputSchema>;

const AffirmationsOutputSchema = z.object({
  affirmations: z.array(z.string()).length(5).describe('A list of 5 affirmations.'),
});
export type AffirmationsOutput = z.infer<typeof AffirmationsOutputSchema>;


export async function generateAffirmations(input: AffirmationsInput): Promise<AffirmationsOutput> {
  return affirmationsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'affirmationsPrompt',
  input: { schema: AffirmationsInputSchema },
  output: { schema: AffirmationsOutputSchema },
  prompt: `You are an expert in positive psychology and mindfulness. 
  Generate a list of exactly 5 uplifting and empowering affirmations for the given category.
  The affirmations should be short, personal (using "I" statements), and present-tense.

  Category: {{{category}}}
  `,
});


const affirmationsFlow = ai.defineFlow(
  {
    name: 'affirmationsFlow',
    inputSchema: AffirmationsInputSchema,
    outputSchema: AffirmationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
