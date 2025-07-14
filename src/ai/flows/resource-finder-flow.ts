
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
  userInput: z.string().optional().describe('A specific user query to refine the resource search.'),
  existingTitles: z.array(z.string()).optional().describe('A list of resource titles that have already been provided to the user, to avoid duplication.'),
});
export type ResourceFinderInput = z.infer<typeof ResourceFinderInputSchema>;

const ResourceSchema = z.object({
    title: z.string().describe('The title of the resource.'),
    description: z.string().describe('A brief, 1-2 line description of the resource.'),
    url: z.string().describe('The direct URL to the resource.'),
    type: z.enum(['Article', 'Tool', 'Helpline', 'App', 'Website']).describe('The type of the resource.'),
});

const ResourceFinderOutputSchema = z.object({
  resources: z.array(ResourceSchema).length(3).describe('A list of exactly 3 relevant resources.'),
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
  Your task is to find exactly 3 highly relevant and trusted external resources for the given concern.
  Provide a diverse set of resource types if possible (e.g., articles, tools, apps, or official helplines).
  Ensure the links are from reputable, well-known, and current sources. Strongly prioritize resources published within the last 2-3 years to ensure the links are active and the information is up-to-date. Avoid obscure blogs or very old content.

  IMPORTANT: Do NOT suggest video resources.

  Concern: {{{concern}}}

  {{#if userInput}}
  The user has provided this specific request for context: "{{{userInput}}}"
  Please tailor the resources to address this specific need in addition to the general concern.
  {{/if}}

  {{#if existingTitles}}
  IMPORTANT: You have already provided the following resources. You MUST find 3 NEW, DIFFERENT resources that are NOT in this list. DO NOT repeat any of the titles listed below.
  Existing Resources:
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
