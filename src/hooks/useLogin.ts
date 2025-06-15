import { useState } from 'react';
import { loginWithEmailAndPassword, resetPassword } from '../services/AuthService';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return null;
    }

    try {
      setError(null);
      setLoading(true);
      console.log("Attempting login with:", email);
      const user = await loginWithEmailAndPassword(email, password);
      console.log("Login successful for user:", user.email);
      return user;
    } catch (error: any) {
      console.error("Login error:", error);
      setError('Login gagal: ' + (error.message || 'Terjadi kesalahan'));
      return null;
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    resetSent,
    handleLogin,
    handleResetPassword
  };
};
