import { useState, useEffect } from 'react';
import { 
  getAllMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  getAllCategories
} from '../services/MenuService';
import { MenuItem, MenuCategory } from '../types/menuTypes';

export const useMenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [menuData, categoryData] = await Promise.all([
        getAllMenuItems(),
        getAllCategories()
      ]);
      
      setMenuItems(menuData);
      setCategories(categoryData);
    } catch (err) {
      setError('Failed to fetch menu data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Test categories
  const testGetCategories = async () => {
    try {
      console.log('Testing categories...');
      const categoryData = await getAllCategories();
      console.log('Categories from database:', categoryData);
      setCategories(categoryData);
    } catch (error) {
      console.error('Error getting categories:', error);
    }
  };

  // Create menu item
  const createMenu = async (formData: MenuItem) => {
    try {
      setLoading(true);
      const newItemId = await createMenuItem(formData);
      setMenuItems(prev => [...prev, { ...formData, id: newItemId }]);
      setError(null);
      return newItemId;
    } catch (err) {
      setError('Failed to create menu item');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update menu item
  const updateMenu = async (id: string, formData: MenuItem) => {
    try {
      setLoading(true);
      await updateMenuItem(id, formData);
      setMenuItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...formData } : item
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update menu item');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete menu item
  const deleteMenu = async (id: string) => {
    try {
      setLoading(true);
      await deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete menu item');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    menuItems,
    categories,
    loading,
    error,
    fetchData,
    testGetCategories,
    createMenu,
    updateMenu,
    deleteMenu,
    setError
  };
};
