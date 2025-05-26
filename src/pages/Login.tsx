import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginWithEmailAndPassword, resetPassword } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAdminUser } = useAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    console.log("Login page - checking auth state:", { hasUser: !!currentUser, isAdmin: isAdminUser });
    
    // If user is already logged in and is admin, redirect to dashboard
    if (currentUser && isAdminUser) {
      console.log("User already logged in, redirecting to dashboard");
      navigate('/admin/dashboard', { replace: true });
    }
  }, [currentUser, isAdminUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      console.log("Attempting login with:", email);
      const user = await loginWithEmailAndPassword(email, password);
      console.log("Login successful for user:", user.email);
      
      // Instead of immediately navigating, wait for auth state to update
      // The AuthContext listener will handle the redirect if needed
      // But we'll still navigate after a short delay as a fallback
      setTimeout(() => {
        console.log("Navigation fallback triggered, going to dashboard");
        navigate('/admin/dashboard', { replace: true });
      }, 1000);
    } catch (error: any) {
      console.error("Login error:", error);
      setError('Login gagal: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Masukkan email untuk reset password');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
    } catch (error: any) {
      setError('Gagal mengirim email reset: ' + (error.message || 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center">Admin Login</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {resetSent && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
            <span className="block sm:inline">Email reset password telah dikirim. Silakan periksa kotak masuk Anda.</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mt-4">
            <label className="block" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="text-sm text-blue-600 hover:underline"
            >
              Lupa Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;