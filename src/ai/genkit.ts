import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!geminiApiKey) {
  if (typeof window === 'undefined') {
    // Server-side logging
    console.error(`
      **********************************************************************************
      *                                                                                *
      *    NEXT_PUBLIC_GEMINI_API_KEY NOT FOUND                                        *
      *    ------------------------------------                                        *
      *    The Gemini API key is missing from your environment variables.              *
      *    Please add it to your .env.local file.                                      *
      *                                                                                *
      *    Example:                                                                    *
      *    NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...                                        *
      *                                                                                *
      **********************************************************************************
    `);
  }
  // We throw an error to prevent the app from running with a misconfiguration.
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined. Please check your .env.local file.");
}


export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
