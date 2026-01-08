"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    async function initAuth() {
      try {
        // In a real app, you might check for a token in localStorage first
        // or call an endpoint that checks the session cookie
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        // Not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('was_logged_in', 'true');
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(name, email, password);
      localStorage.setItem('was_logged_in', 'true');
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      localStorage.removeItem('was_logged_in');
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Failed to refresh user', err);
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
