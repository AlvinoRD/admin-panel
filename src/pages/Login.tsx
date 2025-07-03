import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../hooks/useLogin';

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, isAdminUser } = useAuth();
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    resetSent,
    handleLogin,
    handleResetPassword
  } = useLogin();
  
  // Periksa apakah pengguna sudah login dan adalah admin
  useEffect(() => {
    console.log("Login page - checking auth state:", { hasUser: !!currentUser, isAdmin: isAdminUser });
    
    if (currentUser && isAdminUser) {
      console.log("User already logged in and verified as admin, redirecting to dashboard");
      navigate('/admin/dashboard', { replace: true });
    }
  }, [currentUser, isAdminUser, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = await handleLogin();
    if (user) {
      console.log("Login successful, waiting for admin verification");
      // Tambahkan delay untuk memastikan AuthContext memiliki cukup waktu untuk memverifikasi admin
      setTimeout(() => {
        // Pengecekan ulang status admin setelah AuthContext seharusnya sudah memperbarui status
        if (isAdminUser) {
          console.log("Admin verification confirmed, redirecting to dashboard");
          navigate('/admin/dashboard', { replace: true });
        } else {
          console.log("User not verified as admin, waiting for context update");
          // Tetap di halaman login, useEffect akan mengarahkan jika isAdminUser berubah
        }
      }, 1500); // Tunggu 1.5 detik untuk memastikan proses verifikasi selesai
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
        
        <form onSubmit={onSubmit} className="mt-4">
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