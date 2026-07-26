import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
  updateDoc,
  User
} from '../lib/firebase';
import {
  UserProfile,
  WritingSubmission,
  QuizResult,
  SavedWord,
  LearningGoal,
  UserLevel
} from '../types';

// Custom Auth State Management for Guest Fallback
let customUser: User | null = null;
const authCallbacks: Set<(user: User | null) => void> = new Set();

export function onAuthChange(callback: (user: User | null) => void) {
  authCallbacks.add(callback);

  const unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      customUser = firebaseUser;
      callback(firebaseUser);
    } else if (customUser) {
      callback(customUser);
    } else {
      callback(null);
    }
  });

  return () => {
    authCallbacks.delete(callback);
    unsubscribeFirebase();
  };
}

function setCustomSession(user: User | null) {
  customUser = user;
  authCallbacks.forEach(cb => cb(user));
}

// User Authentication Methods
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    setCustomSession(result.user);
    return result.user;
  } catch (err: any) {
    if (
      err.code === 'auth/operation-not-allowed' || 
      err.message?.includes('operation-not-allowed') ||
      err.code === 'auth/admin-restricted-operation'
    ) {
      console.warn('Firebase Email Auth disabled in console. Falling back to guest student session.');
      const demoUser = {
        uid: 'demo-student-uid',
        email: email || 'student@college.edu',
        displayName: email ? email.split('@')[0] : 'College Student',
      } as unknown as User;
      
      const demoProfile: UserProfile = {
        uid: demoUser.uid,
        email: demoUser.email || 'student@college.edu',
        displayName: email ? email.split('@')[0] : 'College Student',
        targetGoal: 'Academic Essays & College Writing',
        targetLevel: 'Intermediate',
        streakDays: 3,
        lastActiveDate: new Date().toISOString(),
        totalWritingSubmissions: 2,
        totalQuizzesTaken: 1,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', demoUser.uid), demoProfile, { merge: true }).catch(() => {});
      setCustomSession(demoUser);
      return demoUser;
    }
    throw err;
  }
}

export async function registerWithEmail(
  email: string, 
  pass: string, 
  displayName: string
): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    
    // Create initial user profile document in Firestore
    const initialProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName || email.split('@')[0],
      targetGoal: 'Academic Essays & College Writing',
      targetLevel: 'Intermediate',
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      totalWritingSubmissions: 0,
      totalQuizzesTaken: 0,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), initialProfile, { merge: true });
    setCustomSession(user);
    return user;
  } catch (err: any) {
    if (
      err.code === 'auth/operation-not-allowed' || 
      err.message?.includes('operation-not-allowed') ||
      err.code === 'auth/admin-restricted-operation'
    ) {
      console.warn('Firebase Registration Auth disabled in console. Falling back to guest student session.');
      const demoUser = {
        uid: 'demo-student-uid',
        email: email || 'student@college.edu',
        displayName: displayName || 'College Student',
      } as unknown as User;

      const demoProfile: UserProfile = {
        uid: demoUser.uid,
        email: email || 'student@college.edu',
        displayName: displayName || 'College Student',
        targetGoal: 'Academic Essays & College Writing',
        targetLevel: 'Intermediate',
        streakDays: 1,
        lastActiveDate: new Date().toISOString(),
        totalWritingSubmissions: 0,
        totalQuizzesTaken: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', demoUser.uid), demoProfile, { merge: true }).catch(() => {});
      setCustomSession(demoUser);
      return demoUser;
    }
    throw err;
  }
}

export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if profile exists, if not create it
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      const initialProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'College Student',
        targetGoal: 'Academic Essays & College Writing',
        targetLevel: 'Intermediate',
        streakDays: 1,
        lastActiveDate: new Date().toISOString(),
        totalWritingSubmissions: 0,
        totalQuizzesTaken: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, initialProfile);
    }

    setCustomSession(user);
    return user;
  } catch (err: any) {
    if (
      err.code === 'auth/operation-not-allowed' || 
      err.message?.includes('operation-not-allowed') ||
      err.message?.includes('popup-closed') ||
      err.code === 'auth/admin-restricted-operation'
    ) {
      console.warn('Firebase Google Auth error/disabled. Falling back to demo user.');
      const demoUser = {
        uid: 'demo-student-uid',
        email: 'alex.chen@university.edu',
        displayName: 'Alex Chen',
      } as unknown as User;

      const demoProfile: UserProfile = {
        uid: demoUser.uid,
        email: 'alex.chen@university.edu',
        displayName: 'Alex Chen',
        targetGoal: 'Academic Essays & College Writing',
        targetLevel: 'Intermediate',
        streakDays: 5,
        lastActiveDate: new Date().toISOString(),
        totalWritingSubmissions: 4,
        totalQuizzesTaken: 3,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', demoUser.uid), demoProfile, { merge: true }).catch(() => {});
      setCustomSession(demoUser);
      return demoUser;
    }
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth).catch(() => {});
  setCustomSession(null);
}

// User Profile Sync & Firestore Data
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.error('Error fetching user profile from Firestore:', err);
  }

  // Fallback profile if Firestore is uninitialized or document missing
  return {
    uid: uid || 'demo-student-uid',
    email: 'alex.chen@university.edu',
    displayName: 'Alex Chen',
    targetGoal: 'Academic Essays & College Writing',
    targetLevel: 'Intermediate',
    streakDays: 5,
    lastActiveDate: new Date().toISOString(),
    totalWritingSubmissions: 3,
    totalQuizzesTaken: 2,
    createdAt: new Date().toISOString()
  };
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, updates, { merge: true });
  } catch (err) {
    console.error('Error updating user profile:', err);
  }
}

// Writing History Sync
export async function saveWritingSubmission(submission: Omit<WritingSubmission, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, 'writing_history');
    const docRef = await addDoc(colRef, submission);

    // Update user stats in profile
    const userDocRef = doc(db, 'users', submission.userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const currentStats = userSnap.data() as UserProfile;
      await updateDoc(userDocRef, {
        totalWritingSubmissions: (currentStats.totalWritingSubmissions || 0) + 1,
        lastActiveDate: new Date().toISOString()
      });
    }

    return docRef.id;
  } catch (err) {
    console.error('Error saving writing submission to Firestore:', err);
    throw err;
  }
}

export async function getWritingHistory(userId: string): Promise<WritingSubmission[]> {
  try {
    const colRef = collection(db, 'writing_history');
    const q = query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
    const querySnap = await getDocs(q);
    
    return querySnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as WritingSubmission[];
  } catch (err) {
    console.error('Error fetching writing history:', err);
    return [];
  }
}

// Quiz Results Sync
export async function saveQuizResult(result: Omit<QuizResult, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, 'quiz_scores');
    const docRef = await addDoc(colRef, result);

    // Update user stats
    const userDocRef = doc(db, 'users', result.userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const currentStats = userSnap.data() as UserProfile;
      await updateDoc(userDocRef, {
        totalQuizzesTaken: (currentStats.totalQuizzesTaken || 0) + 1,
        lastActiveDate: new Date().toISOString()
      });
    }

    return docRef.id;
  } catch (err) {
    console.error('Error saving quiz result to Firestore:', err);
    throw err;
  }
}

export async function getQuizHistory(userId: string): Promise<QuizResult[]> {
  try {
    const colRef = collection(db, 'quiz_scores');
    const q = query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
    const querySnap = await getDocs(q);

    return querySnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as QuizResult[];
  } catch (err) {
    console.error('Error fetching quiz history:', err);
    return [];
  }
}

// Saved Vocabulary Sync
export async function saveWordToFirestore(word: Omit<SavedWord, 'id'>): Promise<string> {
  try {
    const colRef = collection(db, 'saved_words');
    const docRef = await addDoc(colRef, word);
    return docRef.id;
  } catch (err) {
    console.error('Error saving word to Firestore:', err);
    throw err;
  }
}

export async function getSavedWordsFromFirestore(userId: string): Promise<SavedWord[]> {
  try {
    const colRef = collection(db, 'saved_words');
    const q = query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnap = await getDocs(q);

    return querySnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as SavedWord[];
  } catch (err) {
    console.error('Error fetching saved words:', err);
    return [];
  }
}

export async function deleteSavedWordFromFirestore(docId: string): Promise<void> {
  try {
    const docRef = doc(db, 'saved_words', docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting saved word:', err);
  }
}
