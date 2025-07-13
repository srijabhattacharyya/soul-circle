
import { z } from 'zod';

export const innerWeatherSchema = z.object({
  moodRating: z.number({ required_error: 'Please select a mood rating.' }).min(1).max(5),
  emotions: z.array(z.string()).optional(),
  emotionsOther: z.string().optional(),
  influences: z.array(z.string()).optional(),
  influencesOther: z.string().optional(),
  stressLevel: z.number({ required_error: 'Please select a stress level.' }).min(1).max(10),
  selfCareToday: z.string().optional(),
  personalNote: z.string().optional(),
});

export type InnerWeatherFormValues = z.infer<typeof innerWeatherSchema>;
