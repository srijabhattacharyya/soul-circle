
'use server';

import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, Timestamp, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from './config';
import { deleteUser } from 'firebase/auth';
import type { ProfileFormValues } from '@/app/profile/form-schema';
import type { InnerWeatherFormValues } from '@/app/inner-weather/form-schema';
import type { JournalFormValues } from '@/app/mind-haven/form-schema';

export async function getUserProfile(userId: string) {
  if (!db) throw new Error("Firestore is not initialized.");
  try {
    const docRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as ProfileFormValues;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile.');
  }
}

export async function saveUserProfile(userId: string, data: Partial<ProfileFormValues>) {
  if (!db) throw new Error("Firestore is not initialized.");
  try {
    const docRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    } else {
      await setDoc(docRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Failed to save user profile.');
  }
}

export async function hasMoodEntryForToday(userId: string): Promise<boolean> {
  if (!db) throw new Error("Firestore is not initialized.");
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const q = query(
    collection(db, 'moodTracker'),
    where('uid', '==', userId),
    where('date', '>=', Timestamp.fromDate(startOfToday)),
    where('date', '<', Timestamp.fromDate(endOfToday))
  );
  
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}


export async function saveMoodEntry(userId: string, data: InnerWeatherFormValues) {
  if (!db) throw new Error("Firestore is not initialized.");
  try {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const docId = `${userId}_${dateString}`;
    
    const docRef = doc(db, 'moodTracker', docId);

    const dataToSave = {
      ...data,
      uid: userId,
      date: serverTimestamp(),
    };

    await setDoc(docRef, dataToSave);

  } catch (error) {
    console.error('Error saving mood entry:', error);
    throw new Error('Failed to save mood entry.');
  }
}

export async function saveJournalEntry(userId: string, data: JournalFormValues) {
    if (!db) throw new Error("Firestore is not initialized.");
    try {
        const dataToSave = {
            ...data,
            uid: userId,
            timestamp: serverTimestamp(),
        };
        await addDoc(collection(db, 'journals'), dataToSave);
    } catch (error) {
        console.error('Error saving journal entry:', error);
        throw new Error('Failed to save journal entry.');
    }
}

export async function saveAffirmation(userId: string, affirmation: string) {
    if (!db) throw new Error("Firestore is not initialized.");
    try {
        await addDoc(collection(db, 'savedAffirmations'), {
            uid: userId,
            affirmation,
            savedAt: serverTimestamp(),
        });
    } catch(error) {
        console.error('Error saving affirmation:', error);
        throw new Error('Failed to save affirmation.');
    }
}

type GoalData = {
    mainGoal: string;
    subGoals: string[];
    timeFocus: string;
    moodFocus: string;
    completed: boolean;
};

export async function saveUserGoal(userId: string, goalData: GoalData) {
    if (!db) throw new Error("Firestore is not initialized.");
    try {
        await addDoc(collection(db, 'userGoals'), {
            uid: userId,
            ...goalData,
            createdAt: serverTimestamp(),
        });
    } catch(error) {
        console.error('Error saving user goal:', error);
        throw new Error('Failed to save user goal.');
    }
}

type UserFeedback = {
  uid: string;
  rating: number;
  text: string;
};

export async function saveUserFeedback(feedbackData: UserFeedback) {
    if (!db) throw new Error("Firestore is not initialized.");
    try {
        await addDoc(collection(db, 'userFeedback'), {
            ...feedbackData,
            timestamp: serverTimestamp(),
        });
    } catch(error) {
        console.error('Error saving user feedback:', error);
        throw new Error('Failed to save user feedback.');
    }
}


// NOTE: In a production app, this should be handled by a Cloud Function 
// triggered by user deletion from Firebase Auth to ensure atomicity and security.
// Performing this on the client-side is for demonstration purposes.
export async function deleteUserAccountAndData(userId: string) {
    if (!db || !auth) throw new Error("Firebase is not initialized.");

    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) {
        throw new Error("User not authenticated or mismatched ID.");
    }
    
    try {
        // 1. Delete Firestore Data
        const collectionsToDelete = ['moodTracker', 'journals', 'savedAffirmations', 'userGoals'];
        
        for (const coll of collectionsToDelete) {
            const userDocsQuery = query(collection(db, coll), where('uid', '==', userId));
            const querySnapshot = await getDocs(userDocsQuery);
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        // Delete the main user profile document
        await deleteDoc(doc(db, 'userProfiles', userId));
        
        // 2. Delete User from Authentication
        // This is a sensitive operation and requires recent sign-in.
        // The UI should handle re-authentication before calling this function.
        await deleteUser(currentUser);
        
    } catch (error) {
        console.error("Error deleting user account:", error);
        // The error might be 'auth/requires-recent-login'.
        // The UI should catch this and prompt the user to re-authenticate.
        throw error;
    }
}
