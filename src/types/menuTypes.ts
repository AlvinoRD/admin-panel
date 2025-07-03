// Mendefinisikan tipe data untuk item menu

export interface MenuItem {
  id?: string;
  name: string;
  price: number;
  description?: string;
  category: 'Appetizer' | 'Main Courses' | 'Desserts' | 'Beverages' | string;
  imageUrl?: string;
  isPopular?: boolean;
  available?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuCategory {
  id?: string;
  nama: string; // Sesuai dengan field di Firestore
}