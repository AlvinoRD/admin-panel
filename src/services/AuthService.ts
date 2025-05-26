import { 
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore,
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

// Interface for admin user data in Firestore
interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'superadmin';
  createdAt: Date;
  lastLogin?: Date;
}

// Login with email and password
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login timestamp
    try {
      const userRef = doc(db, 'adminUsers', userCredential.user.uid);
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    } catch (updateError) {
      // Hanya log error, jangan gagalkan proses login
      console.warn('Failed to update last login timestamp:', updateError);
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in: ', error);
    throw error;
  }
};

// Check if user is admin
export const isAdmin = async (user: FirebaseUser): Promise<boolean> => {
  if (!user) return false;
  
  try {
    // Pastikan user sudah terautentikasi sebelum mencoba akses Firestore
    if (!user.uid) return false;
    
    const userRef = doc(db, 'adminUsers', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as AdminUser;
      return userData.role === 'admin' || userData.role === 'superadmin';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status: ', error);
    // Jika terjadi error izin, kembalikan false daripada memunculkan error
    return false;
  }
};

// Register new admin (only super admin can do this)
export const registerAdmin = async (email: string, password: string, displayName: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update displayName
    await updateProfile(user, {
      displayName
    });
    
    // Create admin user in Firestore
    await setDoc(doc(db, 'adminUsers', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      role: 'admin',
      createdAt: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error('Error registering admin: ', error);
    throw error;
  }
};

// Sign out
export const logoutAdmin = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out: ', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password: ', error);
    throw error;
  }
};

// Get admin user data
export const getAdminData = async (uid: string): Promise<AdminUser | null> => {
  if (!uid) return null;
  
  try {
    const userRef = doc(db, 'adminUsers', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as AdminUser;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting admin data: ', error);
    // Kembalikan null daripada memunculkan error
    return null;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void): () => void => {
  return onAuthStateChanged(auth, callback);
};