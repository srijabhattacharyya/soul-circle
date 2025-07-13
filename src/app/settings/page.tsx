
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { settingsSchema, type SettingsFormValues } from './form-schema';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useAuth } from '@/components/auth-provider';
import { getUserProfile, saveUserProfile, deleteUserAccountAndData } from '@/lib/firebase/service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const countryList = ['India', 'USA', 'Canada', 'UK', 'Australia', 'Other'];

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
        name: '',
        middleName: '',
        surname: '',
        age: undefined,
        gender: '',
        city: '',
        state: '',
        country: '',
    },
  });

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getUserProfile(user.uid)
        .then((profile) => {
          if (profile) {
            reset(profile);
          }
        })
        .catch((error) => {
          console.error(error);
          toast({
            title: 'Error',
            description: 'Failed to load your profile.',
            variant: 'destructive',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
        setIsLoading(false);
    }
  }, [user, reset, toast]);

  const onProfileUpdateSubmit = async (data: SettingsFormValues) => {
    if (!user) {
        toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    try {
      await saveUserProfile(user.uid, data);
      toast({
        title: 'Success!',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'There was a problem updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUserAccountAndData(user.uid);
      toast({
        title: 'Account Deleted',
        description: 'Your account and all data have been permanently removed.',
      });
      router.push('/'); // Redirect to home/login page
    } catch (error) {
      console.error('Account deletion error:', error);
      toast({
        title: 'Deletion Failed',
        description: 'Could not delete your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsDeleting(false);
    }
  }

   if (isLoading) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-cyan-100 p-4 sm:p-8 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 max-w-3xl w-full space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-16 w-full mt-8" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-cyan-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 max-w-3xl w-full">
        <h1 className="text-indigo-700 font-bold text-4xl mb-2">SoulCircle</h1>
        <h2 className="text-gray-800 font-semibold text-3xl mb-8 text-center">Settings</h2>

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          {/* Section 1: Change Profile */}
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-indigo-700 font-semibold text-xl py-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <User />
                <div>
                    Change Profile
                    <p className="text-sm font-normal text-gray-600">Update your personal information.</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-5">
              <form onSubmit={handleSubmit(onProfileUpdateSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="name" className='text-black'>Name*</Label>
                        <Controller name="name" control={control} render={({ field }) => <Input {...field} id="name" className="text-black bg-white" />} />
                        {errors.name && (<p className="text-red-600 text-sm mt-1">{errors.name.message}</p>)}
                    </div>
                     <div>
                        <Label htmlFor="middleName" className='text-black'>Middle Name</Label>
                        <Controller name="middleName" control={control} render={({ field }) => <Input {...field} id="middleName" className="text-black bg-white" />} />
                    </div>
                    <div>
                        <Label htmlFor="surname" className='text-black'>Surname</Label>
                        <Controller name="surname" control={control} render={({ field }) => <Input {...field} id="surname" className="text-black bg-white" />} />
                    </div>
                    <div>
                        <Label htmlFor="age" className='text-black'>Age*</Label>
                        <Controller name="age" control={control} render={({ field }) => <Input {...field} id="age" type="number" min="12" onChange={e => field.onChange(parseInt(e.target.value, 10))} className="text-black bg-white" />} />
                        {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>}
                    </div>
                     <div>
                        <Label className='text-black'>Gender Identity*</Label>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="text-black bg-white"><SelectValue placeholder="Select gender" /></SelectTrigger>
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
                        <Label htmlFor="city" className='text-black'>City</Label>
                        <Controller name="city" control={control} render={({ field }) => <Input {...field} id="city" className="text-black bg-white" />} />
                    </div>
                    <div>
                        <Label htmlFor="state" className='text-black'>State</Label>
                        <Controller name="state" control={control} render={({ field }) => <Input {...field} id="state" className="text-black bg-white" />} />
                    </div>
                    <div>
                        <Label className='text-black'>Country</Label>
                        <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="text-black bg-white"><SelectValue placeholder="Select country" /></SelectTrigger>
                                <SelectContent>
                                {countryList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            )}
                        />
                    </div>
                </div>
                 <Button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition mt-6" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                </Button>
              </form>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Delete Account */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-indigo-700 font-semibold text-xl py-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                    <Trash2 />
                     <div>
                        Delete Account
                        <p className="text-sm font-normal text-gray-600">Permanently delete your account and data.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-5">
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md mb-6" role="alert">
                <p className="font-bold">Warning</p>
                <p>Deleting your account is permanent and cannot be undone. All your data, including profile information, journal entries, mood logs, and chat history, will be permanently removed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delete-confirm" className="text-sm font-medium leading-none text-black">To confirm, please type "DELETE" in the box below.</Label>
                 <Input 
                    id="delete-confirm"
                    value={deleteConfirmationInput}
                    onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                    placeholder='DELETE'
                    className="text-black bg-white"
                 />
              </div>
              
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="mt-4" disabled={deleteConfirmationInput !== 'DELETE' || isDeleting}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete Account'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => router.push('/')}>
                Back to Dashboard
            </Button>
        </div>
      </div>
    </div>
  );
}

    