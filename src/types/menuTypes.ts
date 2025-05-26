// Define types for menu items data

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
  name: string;
  order?: number;
  items?: MenuItem[];
}