import { useState } from 'react';
import { MenuItem } from '../types/menuTypes';

interface UseFormManagerProps {
  categories: any[];
  onSubmit: (formData: MenuItem, isEditing: boolean) => Promise<void>;
}

export const useFormManager = ({ categories, onSubmit }: UseFormManagerProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MenuItem>({
    name: '',
    price: 0,
    category: '',
    description: '',
    available: true,
    isPopular: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      category: categories.length > 0 ? categories[0].nama : '',
      description: '',
      available: true,
      isPopular: false
    });
  };

  const openCreateForm = () => {
    resetForm();
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditForm = (item: MenuItem) => {
    setFormData(item);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData, isEditing);
      closeForm();
    } catch (error) {
      // Penanganan kesalahan dilakukan di komponen induk
    }
  };

  return {
    isFormOpen,
    isEditing,
    formData,
    openCreateForm,
    openEditForm,
    closeForm,
    handleInputChange,
    handleSubmit
  };
};
