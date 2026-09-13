import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '../types/schema';
import { apiClient } from '../api/client';

interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdminOrManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('adminToken'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kingday_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.token && res.data.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('kingday_user', JSON.stringify(res.data.user));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('kingday_user');
  };

  const isAuthenticated = !!token;
  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isAdminOrManager,
      }}
    >
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
