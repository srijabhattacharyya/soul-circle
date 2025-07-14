
'use server';

import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, Timestamp, addDoc, deleteDoc, writeBatch, updateDoc, arrayUnion, orderBy, limit } from 'firebase/firestore';
import { db, isConfigValid, auth } from './config';
import { getAuth, updateProfile } from 'firebase/auth';
import type { ProfileFormValues } from '@/app/profile/form-schema';
import type { InnerWeatherFormValues } from '@/app/inner-weather/form-schema';
import type { JournalFormValues } from '@/app/mind-haven/form-schema';
import type { ChatMessage } from '@/components/chat-room';

// USER PROFILE
export async function getUserProfile(userId: string): Promise<ProfileFormValues | null> {
  if (!db) return null; // Return null if db is not initialized
  try {
    const docRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Convert Timestamps to serializable format (ISO strings)
      if (data.createdAt && data.createdAt instanceof Timestamp) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data.updatedAt && data.updatedAt instanceof Timestamp) {
        data.updatedAt = data.updatedAt.toDate().toISOString();
      }
      return data as ProfileFormValues;
    } else {
      console.log(`No profile found for user: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Don't throw, just return null to allow graceful handling in the UI
    return null;
  }
}

export async function saveUserProfile(userId: string, data: Partial<ProfileFormValues>) {
  if (!db || !auth) throw new Error("Firestore is not initialized.");
  try {
    const docRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(docRef);

    const dataToSave = { ...data, updatedAt: serverTimestamp() };

    if (docSnap.exists()) {
      await setDoc(docRef, dataToSave, { merge: true });
    } else {
      await setDoc(docRef, { ...dataToSave, createdAt: serverTimestamp() });
    }

    // Also update the auth user's display name if the name is being changed
    if (data.name && auth.currentUser && auth.currentUser.uid === userId) {
        await updateProfile(auth.currentUser, { displayName: data.name });
    }

  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Failed to save user profile.');
  }
}

// MOOD TRACKER
export interface MoodEntry extends InnerWeatherFormValues {
    id: string;
    uid: string;
    date: Timestamp;
}

export async function hasMoodEntryForToday(userId: string): Promise<boolean> {
  if (!db) return false;
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

export async function getMoodHistory(userId: string): Promise<MoodEntry[]> {
    if (!db) return [];
    try {
        const q = query(
            collection(db, 'moodTracker'),
            where('uid', '==', userId)
            // NOTE: orderBy clause removed to prevent requiring a composite index.
            // Sorting will be handled on the client side.
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoodEntry));
    } catch (error) {
        console.error('Error getting mood history:', error);
        throw new Error('Failed to get mood history.');
    }
}


// JOURNAL
export interface JournalEntry extends JournalFormValues {
    id: string;
    uid: string;
    timestamp: Timestamp;
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

export async function getJournalHistory(userId: string): Promise<JournalEntry[]> {
    if (!db) return [];
    try {
        const q = query(
            collection(db, 'journals'),
            where('uid', '==', userId)
            // NOTE: orderBy clause removed to prevent requiring a composite index.
            // Sorting will be handled on the client side.
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
    } catch (error) {
        console.error('Error getting journal history:', error);
        throw new Error('Failed to get journal history.');
    }
}


// SOOTHE STUDIO (SAVED ITEMS)
export interface SavedAffirmation {
    id: string;
    uid: string;
    affirmation: string;
    savedAt: Timestamp;
}

export interface SavedGoal {
    id: string;
    uid: string;
    mainGoal: string;
    subGoals: string[];
    timeFocus: string;
    moodFocus: string;
    completed: boolean;
    createdAt: Timestamp;
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

export async function deleteSavedAffirmation(affirmationId: string) {
    if (!db) throw new Error("Firestore is not initialized.");
    try {
        await deleteDoc(doc(db, 'savedAffirmations', affirmationId));
    } catch (error) {
        console.error('Error deleting affirmation:', error);
        throw new Error('Failed to delete affirmation.');
    }
}


export async function saveUserGoal(userId: string, goalData: Omit<SavedGoal, 'id' | 'uid' | 'createdAt'>) {
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

export async function getSavedAffirmations(userId: string): Promise<SavedAffirmation[]> {
    if (!db) return [];
    const q = query(collection(db, 'savedAffirmations'), where('uid', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedAffirmation));
}

export async function getSavedGoals(userId: string): Promise<SavedGoal[]> {
    if (!db) return [];
    const q = query(collection(db, 'userGoals'), where('uid', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedGoal));
}

export async function toggleGoalCompletion(goalId: string, completed: boolean) {
    if (!db) throw new Error("Firestore is not initialized.");
    const docRef = doc(db, 'userGoals', goalId);
    await updateDoc(docRef, { completed });
}


// FEEDBACK
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


// ACCOUNT DELETION
export async function deleteUserAccountAndData(userId: string) {
    const auth = getAuth();
    if (!db || !auth) throw new Error("Firebase is not initialized.");

    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) {
        throw new Error("User not authenticated or mismatched ID.");
    }
    
    try {
        const collectionsToDelete = ['moodTracker', 'journals', 'savedAffirmations', 'userGoals', 'chats'];
        
        for (const coll of collectionsToDelete) {
            const userDocsQuery = query(collection(db, coll), where('uid', '==', userId));
            const querySnapshot = await getDocs(userDocsQuery);
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        await deleteDoc(doc(db, 'userProfiles', userId));
        
        await currentUser.delete();
        
    } catch (error) {
        console.error("Error deleting user account:", error);
        throw error;
    }
}

// CARE CIRCLE / CHAT
export async function getCounsellorPersona(counsellorId: string): Promise<string | null> {
  if (!db) return null;
  try {
    const docRef = doc(db, 'counsellors', counsellorId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().aiPersonaPrompt || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching counsellor persona:', error);
    throw new Error('Failed to fetch counsellor persona.');
  }
}

export async function saveMessage(userId: string, counsellorId: string, message: ChatMessage) {
    if (!db) throw new Error("Firestore is not initialized.");
    const chatId = `${userId}_${counsellorId}`;
    const docRef = doc(db, 'chats', chatId);

    const messageToSave = {
        ...message,
        timestamp: Timestamp.now(), // Use client-side timestamp for arrays
    };

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await updateDoc(docRef, {
                messages: arrayUnion(messageToSave)
            });
        } else {
            await setDoc(docRef, {
                uid: userId,
                counsellorId,
                createdAt: serverTimestamp(), // Use server timestamp for new doc
                messages: [messageToSave]
            });
        }
    } catch (error) {
        console.error('Error saving message:', error);
        throw new Error('Failed to save message.');
    }
}

export async function getMessages(userId: string, counsellorId: string, messageLimit: number = 20): Promise<ChatMessage[]> {
    if (!db) return [];
    const chatId = `${userId}_${counsellorId}`;
    const docRef = doc(db, 'chats', chatId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const messages = docSnap.data().messages || [];
        // The array is already ordered by timestamp when saved.
        // We just need to get the last `messageLimit` messages.
        return messages.slice(-messageLimit).map((msg: any) => ({
            ...msg,
            // Ensure content is always an array of parts for consistency
            content: Array.isArray(msg.content) ? msg.content : [{ text: msg.content }]
        }));
    }
    return [];
}
    
