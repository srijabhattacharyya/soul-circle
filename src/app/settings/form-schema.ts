
import { z } from 'zod';

export const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  middleName: z.string().optional(),
  surname: z.string().optional(),
  age: z.number({ required_error: 'Age is required.' }).min(12, 'You must be at least 12 years old.'),
  gender: z.string().min(1, 'Gender is required.'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

    