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
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Order, OrderStatus } from '../types/orderTypes';

const ORDER_COLLECTION = 'orders';

// Mengkonversi Firebase Timestamp ke Date
const convertTimestamp = (timestamp: Timestamp | undefined): Date | undefined => {
  return timestamp ? timestamp.toDate() : undefined;
};

// Format Order untuk Firestore (Date ke Timestamp)
const formatOrder = (order: Order) => {
  const formattedOrder: any = { ...order };
  if (formattedOrder.createdAt instanceof Date) {
    formattedOrder.createdAt = Timestamp.fromDate(formattedOrder.createdAt);
  }
  if (formattedOrder.updatedAt instanceof Date) {
    formattedOrder.updatedAt = Timestamp.fromDate(formattedOrder.updatedAt);
  }
  if (formattedOrder.completedAt instanceof Date) {
    formattedOrder.completedAt = Timestamp.fromDate(formattedOrder.completedAt);
  }
  return formattedOrder;
};

// Format Order dari Firestore (Timestamp ke Date)
const formatOrderFromFirestore = (order: any): Order => {
  return {
    ...order,
    createdAt: convertTimestamp(order.createdAt),
    updatedAt: convertTimestamp(order.updatedAt),
    completedAt: convertTimestamp(order.completedAt)
  };
};

// AMBIL semua pesanan
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const orderCollection = collection(db, ORDER_COLLECTION);
    const orderQuery = query(orderCollection, orderBy('createdAt', 'desc'));
    const orderSnapshot = await getDocs(orderQuery);
    return orderSnapshot.docs.map(doc => {
      const data = doc.data();
      return formatOrderFromFirestore({
        ...data,
        id: doc.id
      });
    });
  } catch (error) {
    console.error('Error getting orders: ', error);
    throw error;
  }
};

// AMBIL pesanan berdasarkan status
export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  try {
    const orderCollection = collection(db, ORDER_COLLECTION);
    const orderQuery = query(
      orderCollection, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const orderSnapshot = await getDocs(orderQuery);
    return orderSnapshot.docs.map(doc => {
      const data = doc.data();
      return formatOrderFromFirestore({
        ...data,
        id: doc.id
      });
    });
  } catch (error) {
    console.error('Error getting orders by status: ', error);
    throw error;
  }
};

// AMBIL pesanan berdasarkan pengguna
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    const orderCollection = collection(db, ORDER_COLLECTION);
    const orderQuery = query(
      orderCollection, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const orderSnapshot = await getDocs(orderQuery);
    return orderSnapshot.docs.map(doc => {
      const data = doc.data();
      return formatOrderFromFirestore({
        ...data,
        id: doc.id
      });
    });
  } catch (error) {
    console.error('Error getting orders by user: ', error);
    throw error;
  }
};

// AMBIL satu pesanan
export const getOrder = async (id: string): Promise<Order | null> => {
  try {
    const orderDocRef = doc(db, ORDER_COLLECTION, id);
    const orderDoc = await getDoc(orderDocRef);
    
    if (orderDoc.exists()) {
      const data = orderDoc.data();
      return formatOrderFromFirestore({
        ...data,
        id: orderDoc.id
      });
    }
    return null;
  } catch (error) {
    console.error('Error getting order: ', error);
    throw error;
  }
};

// BUAT pesanan baru
export const createOrder = async (order: Order): Promise<string> => {
  try {
    const orderToAdd = {
      ...formatOrder(order),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Hapus id jika ada (Firestore akan menghasilkan id baru)
    if (orderToAdd.id) delete orderToAdd.id;
    
    const docRef = await addDoc(collection(db, ORDER_COLLECTION), orderToAdd);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order: ', error);
    throw error;
  }
};

// PERBARUI pesanan
export const updateOrder = async (id: string, order: Partial<Order>): Promise<void> => {
  try {
    const orderDocRef = doc(db, ORDER_COLLECTION, id);
    
    // Jika status diubah menjadi selesai, atur completedAt
    const updateData: any = { ...order, updatedAt: serverTimestamp() };
    if (order.status === OrderStatus.COMPLETED && !order.completedAt) {
      updateData.completedAt = serverTimestamp();
    }
    
    await updateDoc(orderDocRef, updateData);
  } catch (error) {
    console.error('Error updating order: ', error);
    throw error;
  }
};

// PERBARUI status pesanan
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
  try {
    const orderDocRef = doc(db, ORDER_COLLECTION, id);
    const updateData: any = { 
      status, 
      updatedAt: serverTimestamp() 
    };
    
    // Jika status selesai, atur completedAt
    if (status === OrderStatus.COMPLETED) {
      updateData.completedAt = serverTimestamp();
    }
    
    await updateDoc(orderDocRef, updateData);
  } catch (error) {
    console.error('Error updating order status: ', error);
    throw error;
  }
};

// HAPUS pesanan (hanya admin)
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const orderDocRef = doc(db, ORDER_COLLECTION, id);
    await deleteDoc(orderDocRef);
  } catch (error) {
    console.error('Error deleting order: ', error);
    throw error;
  }
};