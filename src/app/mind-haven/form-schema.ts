
import { z } from 'zod';

export const journalSchema = z.object({
  entryText: z.string().min(1, 'Journal entry cannot be empty.'),
  moodTag: z.string().optional(),
});

export type JournalFormValues = z.infer<typeof journalSchema>;
