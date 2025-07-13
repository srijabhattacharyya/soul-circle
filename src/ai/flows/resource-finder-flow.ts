
'use server';
/**
 * @fileOverview An AI flow to find relevant external resources for mental wellness.
 *
 * - findResources - A function that fetches resource links based on a concern.
 * - ResourceFinderInput - The input type for the findResources function.
 * - ResourceFinderOutput - The return type for the findResources function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ResourceFinderInputSchema = z.object({
  concern: z.string().describe('The mental health topic or concern (e.g., "Anxiety", "Exam pressure").'),
  existingTitles: z.array(z.string()).optional().describe('A list of resource titles that have already been provided to the user, to avoid duplication.'),
});
export type ResourceFinderInput = z.infer<typeof ResourceFinderInputSchema>;

const ResourceSchema = z.object({
    title: z.string().describe('The title of the resource.'),
    description: z.string().describe('A brief, 1-2 line description of the resource.'),
    url: z.string().describe('The direct URL to the resource.'),
    type: z.enum(['Article', 'Video', 'Helpline', 'App', 'Tool', 'Website']).describe('The type of the resource.'),
});

const ResourceFinderOutputSchema = z.object({
  resources: z.array(ResourceSchema).min(3).max(5).describe('A list of 3 to 5 relevant resources.'),
});
export type ResourceFinderOutput = z.infer<typeof ResourceFinderOutputSchema>;


export async function findResources(input: ResourceFinderInput): Promise<ResourceFinderOutput> {
  return resourceFinderFlow(input);
}


const prompt = ai.definePrompt({
  name: 'resourceFinderPrompt',
  input: { schema: ResourceFinderInputSchema },
  output: { schema: ResourceFinderOutputSchema },
  prompt: `You are an expert in compiling mental health and wellness resources. 
  Your task is to find 3 to 5 highly relevant and trusted external resources for the given concern.
  Provide a diverse set of resource types if possible (e.g., articles, videos, tools, apps, or official helplines).
  Ensure the links are from reputable sources (e.g., government health organizations, respected non-profits, academic institutions, well-known mental health startups).

  Concern: {{{concern}}}

  {{#if existingTitles}}
  Please find new resources that are not in the following list:
  {{#each existingTitles}}
  - {{{this}}}
  {{/each}}
  {{/if}}
  `,
});


const resourceFinderFlow = ai.defineFlow(
  {
    name: 'resourceFinderFlow',
    inputSchema: ResourceFinderInputSchema,
    outputSchema: ResourceFinderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
