
import { z } from 'zod';

export const profileSchema = z.object({
  // Section 1
  name: z.string().min(1, 'Name is required.'),
  middleName: z.string().optional(),
  surname: z.string().optional(),
  age: z.number({ required_error: 'Age is required.' }).min(12, 'You must be at least 12 years old.'),
  gender: z.string().min(1, 'Gender is required.'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),

  // Section 2
  occupation: z.string().optional(),
  income: z.string().optional(),
  lifeSituation: z.string().optional(),
  supportSystem: z.array(z.string()).optional(),
  supportSystemOther: z.object({
    enabled: z.boolean(),
    value: z.string(),
  }).optional(),

  // Section 3
  counsellingReason: z.array(z.string()).min(1, 'Please select at least one reason.'),
  counsellingReasonOther: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
  symptomsOther: z.string().optional(),
  symptomsDuration: z.string().optional(),
  symptomsSeverity: z.string().optional(),
  knownTriggers: z.string().optional(),
  copingTechniques: z.string().optional(),
  copingTechniquesDescription: z.string().optional(),
  previousTherapy: z.string().optional(),
  previousTherapyDescription: z.string().optional(),
  mentalHealthDiagnosis: z.array(z.string()).optional(),
  mentalHealthDiagnosisOther: z.string().optional(),
  familyHistory: z.string().optional(),
  medication: z.string().optional(),
  medicationDescription: z.string().optional(),

  // Section 4
  dailyRoutine: z.string().optional(),
  substanceUse: z.string().optional(),
  substanceUseDescription: z.string().optional(),
  majorStressors: z.array(z.string()).optional(),
  majorStressorsOther: z.string().optional(),
  willingness: z.string().optional(),
  moodRating: z.array(z.number()).optional(),

  // Section 5
  counsellingGoals: z.array(z.string()).min(1, 'Please select at least one goal.'),
  counsellingGoalsOther: z.string().optional(),
  selfHarmThoughts: z.string().min(1, 'This field is required.'),
  therapyConcerns: z.string().optional(),

  // Consent
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and disclaimer to continue.' }),
  }),

  // Add createdAt and updatedAt to the schema
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
