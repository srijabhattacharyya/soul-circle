
'use server';

import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './config';
import type { ProfileFormValues } from '@/app/profile/form-schema';
import type { InnerWeatherFormValues } from '@/app/inner-weather/form-schema';

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

export async function saveUserProfile(userId: string, data: ProfileFormValues) {
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
