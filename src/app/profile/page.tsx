
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { profileSchema, ProfileFormValues } from './form-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const countryList = ['India', 'USA', 'Canada', 'UK', 'Australia', 'Other'];

const SupportSystemOtherInput = ({ control }: { control: any }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="supportSystemOther"
          render={({ field }) => (
            <Checkbox
              checked={field.value.enabled}
              onCheckedChange={(checked) => {
                field.onChange({ enabled: !!checked, value: '' });
                setShow(!!checked);
              }}
            />
          )}
        />
        <Label>Other</Label>
      </div>
      {show && (
        <Controller
          control={control}
          name="supportSystemOther.value"
          render={({ field }) => (
            <Input {...field} placeholder="Please describe" />
          )}
        />
      )}
    </div>
  );
};

const ConditionalInput = ({
  control,
  radioName,
  triggerValue,
  inputName,
  label,
  placeholder,
}: {
  control: any;
  radioName: keyof ProfileFormValues;
  triggerValue: string;
  inputName: string;
  label: string;
  placeholder: string;
}) => {
  const radioValue = useForm().watch(radioName);
  return radioValue === triggerValue ? (
    <div className="mt-2 space-y-2">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={inputName}
        render={({ field }) => <Input {...field} placeholder={placeholder} />}
      />
    </div>
  ) : null;
};

const OtherCheckboxInput = ({
  control,
  checkboxName,
  inputName,
  options,
}: {
  control: any;
  checkboxName: keyof ProfileFormValues;
  inputName: string;
  options: string[];
}) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Controller
            control={control}
            name={checkboxName}
            render={({ field }) => (
              <Checkbox
                value={option}
                checked={field.value?.includes(option)}
                onCheckedChange={(checked) => {
                  return checked
                    ? field.onChange([...(field.value || []), option])
                    : field.onChange(
                        (field.value || []).filter(
                          (value: string) => value !== option
                        )
                      );
                }}
              />
            )}
          />
          <Label>{option}</Label>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={showOtherInput}
          onCheckedChange={(checked) => setShowOtherInput(!!checked)}
        />
        <Label>Other</Label>
      </div>
      {showOtherInput && (
        <Controller
          control={control}
          name={inputName}
          render={({ field }) => <Input {...field} placeholder="Please specify" />}
        />
      )}
    </div>
  );
};


export default function ProfilePage() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      middleName: '',
      surname: '',
      age: undefined,
      gender: '',
      city: '',
      state: '',
      country: 'India',
      occupation: '',
      income: '',
      lifeSituation: '',
      supportSystem: [],
      supportSystemOther: { enabled: false, value: '' },
      counsellingReason: [],
      counsellingReasonOther: '',
      symptoms: [],
      symptomsOther: '',
      symptomsDuration: '',
      symptomsSeverity: '',
      knownTriggers: '',
      copingTechniques: '',
      copingTechniquesDescription: '',
      previousTherapy: '',
      previousTherapyDescription: '',
      mentalHealthDiagnosis: [],
      mentalHealthDiagnosisOther: '',
      familyHistory: '',
      medication: '',
      medicationDescription: '',
      dailyRoutine: '',
      substanceUse: '',
      substanceUseDescription: '',
      majorStressors: [],
      majorStressorsOther: '',
      willingness: '',
      moodRating: [5],
      selfHarmThoughts: '',
      therapyConcerns: '',
      consent: false,
    },
  });

  const selfHarmThoughtsValue = watch('selfHarmThoughts');

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data);
    alert('Profile submitted successfully!');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-cyan-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 max-w-3xl w-full">
        <h1 className="text-black font-bold text-4xl mb-2">
          SoulCircle
        </h1>
        <h2 className="text-black font-semibold text-3xl mb-4">
          Tell us about Yourself
        </h2>
        <p className="text-black text-lg mb-8">
          Your profile helps SoulCircle personalise your wellness journey. By
          sharing a few details—we can tailor your counselling experience, mood
          insights, and self-help tools to better support you.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Accordion type="single" collapsible className="w-full">
            {/* Section 1: Basic Information */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-black font-semibold text-xl py-4 border-b border-gray-200">
                Basic Information
              </AccordionTrigger>
              <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name*</Label>
                  <Controller name="name" control={control} render={({ field }) => <Input {...field} id="name" />} />
                  {errors.name && (<p className="text-red-600 text-sm mt-1">{errors.name.message}</p>)}
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Controller name="middleName" control={control} render={({ field }) => <Input {...field} id="middleName" />} />
                </div>
                <div>
                  <Label htmlFor="surname">Surname</Label>
                  <Controller name="surname" control={control} render={({ field }) => <Input {...field} id="surname" />} />
                </div>
                <div>
                  <Label htmlFor="age">Age*</Label>
                  <Controller name="age" control={control} render={({ field }) => <Input {...field} id="age" type="number" min="12" onChange={e => field.onChange(parseInt(e.target.value, 10))} />} />
                  {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>}
                </div>
                <div>
                  <Label>Gender Identity*</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Controller name="city" control={control} render={({ field }) => <Input {...field} id="city" />} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Controller name="state" control={control} render={({ field }) => <Input {...field} id="state" />} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent>
                          {countryList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: Personal & Social Background */}
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-black font-semibold text-xl py-4 border-b border-gray-200">
                Personal & Social Background
              </AccordionTrigger>
              <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="occupation">Occupation/Job Role</Label>
                  <Controller name="occupation" control={control} render={({ field }) => <Input {...field} id="occupation" />} />
                </div>
                <div>
                  <Label>Family Monthly Income Bracket</Label>
                  <Controller
                    name="income"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select income bracket" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="<25000">Below ₹25,000</SelectItem>
                            <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                            <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                            <SelectItem value=">100000">Above ₹1,00,000</SelectItem>
                            <SelectItem value="not-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="lifeSituation">Current Life Situation</Label>
                  <Controller name="lifeSituation" control={control} render={({ field }) => <Textarea {...field} id="lifeSituation" placeholder="e.g., living alone/with family, employment status, recent life changes" />} />
                </div>
                <div className="md:col-span-2">
                  <Label>Support System</Label>
                  <div className="space-y-2">
                    {['Family', 'Friends', 'Partner', 'No one'].map(item => (
                       <div key={item} className="flex items-center space-x-2">
                          <Controller
                            control={control}
                            name="supportSystem"
                            render={({ field }) => (
                                <Checkbox
                                    value={item}
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      const updated = checked ? [...current, item] : current.filter(v => v !== item);
                                      field.onChange(updated);
                                    }}
                                />
                            )}
                          />
                          <Label>{item}</Label>
                       </div>
                    ))}
                    <SupportSystemOtherInput control={control}/>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Section 3: Counselling Needs */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-black font-semibold text-xl py-4 border-b border-gray-200">Counselling Needs</AccordionTrigger>
              <AccordionContent className="pt-4 grid grid-cols-1 gap-6">
                <div>
                    <Label>Main Reason for Seeking Counselling*</Label>
                    <OtherCheckboxInput control={control} checkboxName="counsellingReason" inputName="counsellingReasonOther" options={["Anxiety", "Depression", "Relationship issues", "Career stress", "Loss/Grief", "Low self-esteem", "Trauma", "Loneliness"]} />
                    {errors.counsellingReason && <p className="text-red-600 text-sm mt-1">{errors.counsellingReason.message}</p>}
                </div>
                <div>
                    <Label>Specific Symptoms Experienced</Label>
                    <OtherCheckboxInput control={control} checkboxName="symptoms" inputName="symptomsOther" options={["Sadness", "Worry", "Irritability", "Panic Attacks", "Sleep issues", "Appetite changes", "Loss of interest", "Guilt", "Fatigue", "Poor focus"]} />
                </div>
                <div>
                  <Label>Duration of Symptoms</Label>
                  <Controller name="symptomsDuration" control={control} render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          {["Less than 2 weeks", "2–8 weeks", "2–6 months", "Over 6 months"].map(item => (
                              <div key={item} className="flex items-center space-x-2"><RadioGroupItem value={item} id={`duration-${item}`} /><Label htmlFor={`duration-${item}`}>{item}</Label></div>
                          ))}
                      </RadioGroup>
                  )} />
                </div>
                <div>
                  <Label>Severity of Symptoms</Label>
                  <Controller name="symptomsSeverity" control={control} render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          {["Mild", "Moderate", "Severe", "Debilitating"].map(item => (
                              <div key={item} className="flex items-center space-x-2"><RadioGroupItem value={item} id={`severity-${item}`} /><Label htmlFor={`severity-${item}`}>{item}</Label></div>
                          ))}
                      </RadioGroup>
                  )} />
                </div>
                <div>
                    <Label htmlFor="knownTriggers">Known Triggers</Label>
                    <Controller name="knownTriggers" control={control} render={({ field }) => <Textarea {...field} id="knownTriggers"/>} />
                </div>
                <div>
                  <Label>Have you ever tried coping techniques?</Label>
                  <Controller name="copingTechniques" control={control} render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="coping-yes" /><Label htmlFor="coping-yes">Yes</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="coping-no" /><Label htmlFor="coping-no">No</Label></div>
                      </RadioGroup>
                  )} />
                  <ConditionalInput control={control} radioName="copingTechniques" triggerValue="Yes" inputName="copingTechniquesDescription" label="Please describe" placeholder="e.g., breathing exercises, meditation" />
                </div>
                 <div>
                  <Label>Previous counseling/therapy?</Label>
                  <Controller name="previousTherapy" control={control} render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="therapy-yes" /><Label htmlFor="therapy-yes">Yes</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="therapy-no" /><Label htmlFor="therapy-no">No</Label></div>
                      </RadioGroup>
                  )} />
                  <ConditionalInput control={control} radioName="previousTherapy" triggerValue="Yes" inputName="previousTherapyDescription" label="When and for how long?" placeholder="e.g., 2 years ago for 3 months" />
                </div>
                <div>
                  <Label>Any previous mental health diagnosis?</Label>
                  <OtherCheckboxInput control={control} checkboxName="mentalHealthDiagnosis" inputName="mentalHealthDiagnosisOther" options={["None", "Anxiety", "Depression", "PTSD", "Bipolar"]} />
                </div>
                <div>
                  <Label>Family history of mental health issues?</Label>
                  <Controller name="familyHistory" control={control} render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                         {["Yes", "No", "Not Sure"].map(item => (
                              <div key={item} className="flex items-center space-x-2"><RadioGroupItem value={item} id={`family-${item}`} /><Label htmlFor={`family-${item}`}>{item}</Label></div>
                          ))}
                      </RadioGroup>
                  )} />
                </div>
                 <div>
                  <Label>Do you currently take medication?</Label>
                  <Controller name="medication" control={control} render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="meds-yes" /><Label htmlFor="meds-yes">Yes</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="meds-no" /><Label htmlFor="meds-no">No</Label></div>
                      </RadioGroup>
                  )} />
                  <ConditionalInput control={control} radioName="medication" triggerValue="Yes" inputName="medicationDescription" label="For what condition?" placeholder="e.g., Anxiety" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 4: Lifestyle & Behaviour */}
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-black font-semibold text-xl py-4 border-b border-gray-200">Lifestyle & Behaviour</AccordionTrigger>
              <AccordionContent className="pt-4 grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="dailyRoutine">Describe your daily routine</Label>
                  <Controller name="dailyRoutine" control={control} render={({ field }) => <Textarea {...field} id="dailyRoutine" placeholder="Include sleep, meals, work, self-care, etc." />} />
                </div>
                <div>
                  <Label>Substance use</Label>
                  <Controller name="substanceUse" control={control} render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          {["No", "Occasionally", "Regularly"].map(item => (
                              <div key={item} className="flex items-center space-x-2"><RadioGroupItem value={item} id={`substance-${item}`} /><Label htmlFor={`substance-${item}`}>{item}</Label></div>
                          ))}
                      </RadioGroup>
                  )} />
                  {watch('substanceUse') && watch('substanceUse') !== 'No' && (
                    <div className='mt-2'>
                       <Controller name="substanceUseDescription" control={control} render={({ field }) => <Input {...field} placeholder="Describe substance use" />} />
                    </div>
                  )}
                </div>
                <div>
                  <Label>Major stressors</Label>
                   <OtherCheckboxInput control={control} checkboxName="majorStressors" inputName="majorStressorsOther" options={["Work", "Finances", "Relationships", "Health", "Studies"]} />
                </div>
                <div>
                  <Label>Willingness to try journaling, breathing, or guided tools</Label>
                  <Controller name="willingness" control={control} render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          {["Yes", "Maybe", "Not sure"].map(item => (
                              <div key={item} className="flex items-center space-x-2"><RadioGroupItem value={item} id={`willingness-${item}`} /><Label htmlFor={`willingness-${item}`}>{item}</Label></div>
                          ))}
                      </RadioGroup>
                  )} />
                </div>
                <div>
                  <Label>Current mood rating (1-10)</Label>
                   <Controller
                      name="moodRating"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Slider
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            max={10}
                            min={1}
                            step={1}
                          />
                          <div className="text-center font-semibold mt-2 text-indigo-700">{field.value}</div>
                        </>
                      )}
                    />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 5: Counselling Goals & Safety */}
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-black font-semibold text-xl py-4 border-b border-gray-200">Counselling Goals & Safety</AccordionTrigger>
              <AccordionContent className="pt-4 grid grid-cols-1 gap-6">
                 <div>
                    <Label>What do you hope to achieve through counseling?*</Label>
                    <OtherCheckboxInput control={control} checkboxName="counsellingGoals" inputName="counsellingGoalsOther" options={["Feel emotionally stable", "Improve relationships", "Reduce anxiety", "Gain clarity", "Set goals", "Build confidence"]} />
                    {errors.counsellingGoals && <p className="text-red-600 text-sm mt-1">{errors.counsellingGoals.message}</p>}
                </div>
                 <div>
                    <Label>Have you ever had thoughts of self-harm or suicide?*</Label>
                    <Controller name="selfHarmThoughts" control={control} render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            {["No", "Yes in the past", "Yes currently"].map(item => (
                                <div key={item} className="flex items-center space-x-2"><RadioGroupItem value={item} id={`selfharm-${item}`} /><Label htmlFor={`selfharm-${item}`}>{item}</Label></div>
                            ))}
                        </RadioGroup>
                    )} />
                    {selfHarmThoughtsValue === "Yes currently" && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative font-semibold text-base my-4">
                            We strongly recommend seeking immediate help from a licensed mental health professional or emergency services in your area.
                        </div>
                    )}
                    {errors.selfHarmThoughts && <p className="text-red-600 text-sm mt-1">{errors.selfHarmThoughts.message}</p>}
                </div>
                <div>
                  <Label htmlFor="therapyConcerns">Any fears or concerns about therapy?</Label>
                  <Controller name="therapyConcerns" control={control} render={({ field }) => <Textarea {...field} id="therapyConcerns" />} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-6 border-t border-gray-200">
             <div className="flex items-start space-x-3">
              <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                   <Checkbox
                      id="consent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                   />
                )}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I understand that this app provides AI-based counselling support and is not a replacement for licensed medical or psychiatric treatment. I consent to use this service for non-clinical mental health support.
                </label>
              </div>
            </div>
            {errors.consent && <p className="text-red-600 text-sm mt-2">{errors.consent.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-6 rounded-lg">
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
