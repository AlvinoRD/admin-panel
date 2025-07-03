import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

// Antarmuka untuk data pengguna admin di Firestore
interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'superadmin';
  createdAt: Date;
  lastLogin?: Date;
}

// Login dengan email dan password
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Perbarui timestamp login terakhir
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

// Periksa apakah user adalah admin
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

// Daftarkan admin baru (hanya super admin yang dapat melakukannya)
export const registerAdmin = async (email: string, password: string, displayName: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Perbarui displayName
    await updateProfile(user, {
      displayName
    });
    
    // Buat pengguna admin di Firestore
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

// Keluar
export const logoutAdmin = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out: ', error);
    throw error;
  }
};

// Atur ulang password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password: ', error);
    throw error;
  }
};

// Ambil data pengguna admin
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

// Listener status autentikasi
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void): () => void => {
  return onAuthStateChanged(auth, callback);
};