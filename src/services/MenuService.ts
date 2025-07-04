import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { MenuItem, MenuCategory } from '../types/menuTypes';

const MENU_COLLECTION = 'menuItems';
const CATEGORY_COLLECTION = 'categories'; // Sesuai dengan collection yang sudah Anda buat

// Mengkonversi Firebase Timestamp ke Date
const convertTimestamp = (timestamp: Timestamp | undefined): Date | undefined => {
  return timestamp ? timestamp.toDate() : undefined;
};

// Format MenuItem untuk Firestore (Date ke Timestamp)
const formatMenuItem = (item: MenuItem) => {
  const formattedItem: any = { ...item };
  if (formattedItem.createdAt instanceof Date) {
    formattedItem.createdAt = Timestamp.fromDate(formattedItem.createdAt);
  }
  if (formattedItem.updatedAt instanceof Date) {
    formattedItem.updatedAt = Timestamp.fromDate(formattedItem.updatedAt);
  }
  return formattedItem;
};

// Format MenuItem dari Firestore (Timestamp ke Date)
const formatMenuItemFromFirestore = (item: any): MenuItem => {
  return {
    ...item,
    createdAt: convertTimestamp(item.createdAt),
    updatedAt: convertTimestamp(item.updatedAt)
  };
};

// AMBIL semua item menu
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuCollection = collection(db, MENU_COLLECTION);
    const menuSnapshot = await getDocs(menuCollection);
    return menuSnapshot.docs.map(doc => {
      const data = doc.data();
      return formatMenuItemFromFirestore({
        ...data,
        id: doc.id
      });
    });
  } catch (error) {
    console.error('Error getting menu items: ', error);
    throw error;
  }
};

// AMBIL item menu berdasarkan kategori
export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  try {
    const menuCollection = collection(db, MENU_COLLECTION);
    const menuQuery = query(menuCollection, where('category', '==', category));
    const menuSnapshot = await getDocs(menuQuery);
    return menuSnapshot.docs.map(doc => {
      const data = doc.data();
      return formatMenuItemFromFirestore({
        ...data,
        id: doc.id
      });
    });
  } catch (error) {
    console.error('Error getting menu items by category: ', error);
    throw error;
  }
};

// AMBIL satu item menu
export const getMenuItem = async (id: string): Promise<MenuItem | null> => {
  try {
    const menuDocRef = doc(db, MENU_COLLECTION, id);
    const menuDoc = await getDoc(menuDocRef);
    
    if (menuDoc.exists()) {
      const data = menuDoc.data();
      return formatMenuItemFromFirestore({
        ...data,
        id: menuDoc.id
      });
    }
    return null;
  } catch (error) {
    console.error('Error getting menu item: ', error);
    throw error;
  }
};

// BUAT item menu baru
export const createMenuItem = async (menuItem: MenuItem): Promise<string> => {
  try {
    const itemToAdd = {
      ...formatMenuItem(menuItem),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Hapus id jika ada (Firestore akan menghasilkan id baru)
    if (itemToAdd.id) delete itemToAdd.id;
    
    const docRef = await addDoc(collection(db, MENU_COLLECTION), itemToAdd);
    return docRef.id;
  } catch (error) {
    console.error('Error creating menu item: ', error);
    throw error;
  }
};

// PERBARUI item menu
export const updateMenuItem = async (id: string, menuItem: Partial<MenuItem>): Promise<void> => {
  try {
    const menuDocRef = doc(db, MENU_COLLECTION, id);
    const updateData = {
      ...formatMenuItem(menuItem as MenuItem),
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(menuDocRef, updateData);
  } catch (error) {
    console.error('Error updating menu item: ', error);
    throw error;
  }
};

// HAPUS item menu
export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const menuDocRef = doc(db, MENU_COLLECTION, id);
    await deleteDoc(menuDocRef);
  } catch (error) {
    console.error('Error deleting menu item: ', error);
    throw error;
  }
};

// Operasi Kategori

// AMBIL semua kategori
export const getAllCategories = async (): Promise<MenuCategory[]> => {
  try {
    const categoryCollection = collection(db, CATEGORY_COLLECTION);
    const categorySnapshot = await getDocs(categoryCollection);
    return categorySnapshot.docs.map(doc => {
      return {
        ...doc.data(),
        id: doc.id
      } as MenuCategory;
    });
  } catch (error) {
    console.error('Error getting categories: ', error);
    throw error;
  }
};

// BUAT kategori
export const createCategory = async (category: MenuCategory): Promise<string> => {
  try {
    const categoryToAdd = { ...category };
    if (categoryToAdd.id) delete categoryToAdd.id;
    
    const docRef = await addDoc(collection(db, CATEGORY_COLLECTION), categoryToAdd);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category: ', error);
    throw error;
  }
};

// PERBARUI kategori
export const updateCategory = async (id: string, category: Partial<MenuCategory>): Promise<void> => {
  try {
    const categoryDocRef = doc(db, CATEGORY_COLLECTION, id);
    await updateDoc(categoryDocRef, category);
  } catch (error) {
    console.error('Error updating category: ', error);
    throw error;
  }
};

// HAPUS kategori
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryDocRef = doc(db, CATEGORY_COLLECTION, id);
    await deleteDoc(categoryDocRef);
  } catch (error) {
    console.error('Error deleting category: ', error);
    throw error;
  }
};