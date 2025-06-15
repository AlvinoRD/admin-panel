// Utils untuk mengelola kategori
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// Cek apakah kategori sudah ada
export const checkCategoriesExist = async (): Promise<boolean> => {
  try {
    const categoryCollection = collection(db, 'categories'); // Menggunakan collection 'categories'
    const categorySnapshot = await getDocs(categoryCollection);
    return categorySnapshot.docs.length > 0;
  } catch (error) {
    console.error('Error checking categories:', error);
    return false;
  }
};

// Tambah kategori single dengan field 'nama'
export const addSingleCategory = async (categoryName: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), { nama: categoryName }); // Menggunakan field 'nama'
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Kategori default yang sesuai dengan tipe data Anda
export const DEFAULT_CATEGORIES = [
  'Appetizer',
  'Main Courses', 
  'Desserts',
  'Beverages'
] as const;

// Kategori sebagai array of objects untuk konsistensi dengan interface MenuCategory
export const DEFAULT_CATEGORY_OBJECTS = [
  { nama: 'Appetizer' },
  { nama: 'Main Courses' },
  { nama: 'Desserts' },
  { nama: 'Beverages' }
];
