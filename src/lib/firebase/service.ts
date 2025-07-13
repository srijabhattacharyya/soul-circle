'use server';

import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, Timestamp, addDoc, deleteDoc, writeBatch, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from './config';
import { deleteUser, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import type { ProfileFormValues } from '@/app/profile/form-schema';
import type { InnerWeatherFormValues } from '@/app/inner-weather/form-schema';
import type { JournalFormValues } from '@/app/mind-haven/form-schema';
import type { ChatMessage } from '@/components/chat-room';

// AUTHENTICATION
export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase Auth is not initialized.");
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile already exists
    const userProfile = await getUserProfile(user.uid);
    if (!userProfile) {
      // Create a basic profile for new users
      const newUserProfile: Partial<ProfileFormValues> = {
        name: user.displayName || '',
        age: 25, // Default age, user should update
        gender: 'Prefer not to say',
        counsellingReason: [],
        counsellingGoals: [],
        selfHarmThoughts: 'No',
        consent: true,
      };
      await saveUserProfile(user.uid, newUserProfile);
    }
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw new Error("Google Sign-In failed.");
  }
}

// USER PROFILE
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

// MOOD TRACKER
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

// JOURNAL
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

// SOOTHE STUDIO
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
    if (!db || !auth) throw new Error("Firebase is not initialized.");

    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) {
        throw new Error("User not authenticated or mismatched ID.");
    }
    
    try {
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

        await deleteDoc(doc(db, 'userProfiles', userId));
        
        await deleteUser(currentUser);
        
    } catch (error) {
        console.error("Error deleting user account:", error);
        throw error;
    }
}

// CARE CIRCLE / CHAT
export async function getCounsellorPersona(counsellorId: string): Promise<string | null> {
  if (!db) throw new Error("Firestore is not initialized.");
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
    const docSnap = await getDoc(docRef);

    const messageToSave = {
        ...message,
        timestamp: serverTimestamp(),
    };

    try {
        if (docSnap.exists()) {
            await updateDoc(docRef, {
                messages: arrayUnion(messageToSave)
            });
        } else {
            await setDoc(docRef, { 
                messages: [messageToSave],
                userId,
                counsellorId,
                createdAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error saving message:', error);
        throw new Error('Failed to save message.');
    }
}