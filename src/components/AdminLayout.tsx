import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutAdmin } from '../services/AuthService';

export default function AdminLayout() {
  const { adminData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Navigation */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 bg-gray-900">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
          <p className="text-sm text-gray-400">{adminData?.displayName || 'Admin User'}</p>
          <p className="text-xs text-gray-500 mt-1">{adminData?.role || 'admin'}</p>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-700">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/menu" className="block px-4 py-2 hover:bg-gray-700">Menu Items</Link>
            </li>
            <li>
              <Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-700">Orders</Link>
            </li>
            {adminData?.role === 'superadmin' && (
              <li>
                <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-700">Admin Users</Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>      </div>
    </div>
  );
}