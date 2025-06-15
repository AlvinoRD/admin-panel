import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuManager from './pages/MenuManager';
import OrderManager from './pages/OrderManager';
import { useAuth } from './context/AuthContext';

// Komponen untuk menangani redirect berdasarkan status login
const AuthRedirect = () => {
  const { currentUser, loading } = useAuth();
  
  // Jika masih loading, tampilkan loading screen
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Jika user sudah login, arahkan ke admin dashboard
  // Jika belum login, arahkan ke halaman login
  return currentUser ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />;
};

// Halaman unauthorized
const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-3xl font-bold text-red-600 mb-3">Akses Ditolak</h1>
    <p className="text-lg text-gray-700 mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
    <button 
      onClick={() => window.location.href = '/login'} 
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Kembali ke Login
    </button>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="orders" element={<OrderManager />} />
          </Route>
          
          {/* Redirect root to login check */}
          <Route path="/" element={<AuthRedirect />} />
          
          {/* 404 route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
