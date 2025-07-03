import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function PrivateRoute({ children, requireAdmin = true }: PrivateRouteProps) {
  const { currentUser, isAdminUser, loading, adminData } = useAuth();
  const location = useLocation();

  // Logging untuk debugging
  useEffect(() => {
    console.log("PrivateRoute rendering path:", location.pathname);
    console.log("Auth state in PrivateRoute:", { 
      hasUser: !!currentUser, 
      isAdmin: isAdminUser, 
      loading,
      adminData 
    });
  }, [currentUser, isAdminUser, loading, adminData, location]);

  // Tampilkan loading indicator selama proses autentikasi
  if (loading) {
    console.log("PrivateRoute is loading...");
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading authentication...</span>
      </div>
    );
  }

  // Jika user tidak login, redirect ke halaman login
  if (!currentUser) {
    console.log("No user, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika butuh admin tapi user bukan admin, redirect ke unauthorized
  if (requireAdmin && !isAdminUser) {
    console.log("User is not admin, redirecting to unauthorized");
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  // User sudah login dan memenuhi persyaratan
  console.log("Access granted to:", location.pathname);
  return <>{children}</>;
}