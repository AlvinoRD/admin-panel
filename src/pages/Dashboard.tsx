import React, { useEffect, useState } from 'react';
import { getAllMenuItems } from '../services/MenuService';
import { getAllOrders } from '../services/OrderService';
import { MenuItem } from '../types/menuTypes';
import { Order, OrderStatus } from '../types/orderTypes';

const Dashboard: React.FC = () => {
  const [menuCount, setMenuCount] = useState(0);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch menu items count
        const menuItems = await getAllMenuItems();
        setMenuCount(menuItems.length);
        
        // Fetch orders and calculate stats
        const orders = await getAllOrders();
        
        const stats = {
          total: orders.length,
          pending: orders.filter(order => order.status === OrderStatus.PENDING).length,
          processing: orders.filter(order => order.status === OrderStatus.PROCESSING).length,
          ready: orders.filter(order => order.status === OrderStatus.READY).length,
          completed: orders.filter(order => order.status === OrderStatus.COMPLETED).length,
          cancelled: orders.filter(order => order.status === OrderStatus.CANCELLED).length
        };
        
        setOrderStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Menu Items Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            <span className="text-3xl font-bold text-blue-600">{menuCount}</span>
          </div>
          <p className="text-gray-500 mt-2">Total menu items in database</p>
        </div>
        
        {/* Total Orders Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <span className="text-3xl font-bold text-green-600">{orderStats.total}</span>
          </div>
          <p className="text-gray-500 mt-2">All orders in system</p>
        </div>
        
        {/* Pending Orders Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pending Orders</h2>
            <span className="text-3xl font-bold text-yellow-600">{orderStats.pending}</span>
          </div>
          <p className="text-gray-500 mt-2">Orders waiting to be processed</p>
        </div>
      </div>
      
      {/* Order Status Summary */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Status Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-yellow-100 rounded-md">
            <div className="text-sm text-yellow-800">Pending</div>
            <div className="text-2xl font-bold">{orderStats.pending}</div>
          </div>
          <div className="p-4 bg-blue-100 rounded-md">
            <div className="text-sm text-blue-800">Processing</div>
            <div className="text-2xl font-bold">{orderStats.processing}</div>
          </div>
          <div className="p-4 bg-indigo-100 rounded-md">
            <div className="text-sm text-indigo-800">Ready</div>
            <div className="text-2xl font-bold">{orderStats.ready}</div>
          </div>
          <div className="p-4 bg-green-100 rounded-md">
            <div className="text-sm text-green-800">Completed</div>
            <div className="text-2xl font-bold">{orderStats.completed}</div>
          </div>
          <div className="p-4 bg-red-100 rounded-md">
            <div className="text-sm text-red-800">Cancelled</div>
            <div className="text-2xl font-bold">{orderStats.cancelled}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;