import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('gys_token');
    if (token) {
      try {
        const response = await apiService.getMe();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('gys_token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await apiService.login({ email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('gys_token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('gys_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
