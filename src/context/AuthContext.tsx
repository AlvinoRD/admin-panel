import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange, isAdmin, getAdminData } from '../services/AuthService';

interface AuthContextProps {
  currentUser: FirebaseUser | null;
  isAdminUser: boolean;
  loading: boolean;
  adminData: {
    role?: 'admin' | 'superadmin';
    displayName?: string;
  } | null;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  isAdminUser: false,
  loading: true,
  adminData: null
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminData, setAdminData] = useState<AuthContextProps['adminData']>(null);

  useEffect(() => {
    console.log("AuthProvider initialized - setting up auth listener");
    
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log("Auth state changed:", user ? `User: ${user.email}` : "No user");
      setCurrentUser(user);
      setLoading(true);

      if (user) {
        console.log("Checking admin status for:", user.uid);
        try {
          const adminStatus = await isAdmin(user);
          console.log("Admin status result:", adminStatus);
          setIsAdminUser(adminStatus);

          if (adminStatus) {
            console.log("User is admin, fetching admin data");
            const userData = await getAdminData(user.uid);
            console.log("Admin data:", userData);
            setAdminData({
              role: userData?.role,
              displayName: userData?.displayName
            });
          } else {
            console.log("User is NOT an admin");
            setAdminData(null);
          }
        } catch (error) {
          console.error("Error during admin verification:", error);
          setIsAdminUser(false);
          setAdminData(null);
        }
      } else {
        console.log("No user, resetting admin status");
        setIsAdminUser(false);
        setAdminData(null);
      }

      setLoading(false);      console.log("Auth loading complete, state:", { 
        isUser: !!user, 
        isAdmin: user ? isAdminUser : false,
        loading: false 
      });
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    currentUser,
    isAdminUser,
    loading,
    adminData
  };

  console.log("AuthContext rendering with:", { 
    hasUser: !!currentUser, 
    isAdmin: isAdminUser, 
    loading 
  });
  return (
    <AuthContext.Provider value={value}>
      {children} {/* Render children regardless of loading state */}
    </AuthContext.Provider>
  );
}