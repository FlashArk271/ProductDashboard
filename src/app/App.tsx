import { useState, useEffect } from 'react';
import AuthPage from '@/app/components/AuthPage';
import Dashboard from '@/app/components/Dashboard';
import { Toaster } from 'sonner';
import { api } from '@/utils/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid token
    const validateToken = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Try to validate the token by making a test request
      try {
        await api.getProducts();
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Token validation failed, clearing token');
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-[#f7f8fa]">
        <div className="text-[#98a2b3]">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="size-full">
        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        )}
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
}