// Types for orders and cart items

import { MenuItem } from './menuTypes';

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  notes?: string;
}

export interface Cart {
  id?: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod?: string;
  deliveryAddress?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}