'use server';
/**
 * @fileOverview An AI flow to generate a portrait image.
 *
 * - generatePortrait - A function that generates an image from a prompt.
 * - GeneratePortraitInput - The input type for the generatePortrait function.
 * - GeneratePortraitOutput - The return type for the generatePortrait function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePortraitInputSchema = z.object({
  prompt: z
    .string()
    .describe('A detailed text prompt to generate the portrait from.'),
});
export type GeneratePortraitInput = z.infer<
  typeof GeneratePortraitInputSchema
>;

const GeneratePortraitOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      'The generated image as a data URI.'
    ),
});
export type GeneratePortraitOutput = z.infer<
  typeof GeneratePortraitOutputSchema
>;

export async function generatePortrait(
  input: GeneratePortraitInput
): Promise<GeneratePortraitOutput> {
  return generatePortraitFlow(input);
}

const generatePortraitFlow = ai.defineFlow(
  {
    name: 'generatePortraitFlow',
    inputSchema: GeneratePortraitInputSchema,
    outputSchema: GeneratePortraitOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
