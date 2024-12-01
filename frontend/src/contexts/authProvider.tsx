import api from '@/lib/api';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: { userId: string; name: string, email: string, username : string, profile_photo: string } | null;
  login: (user: { userId: string; name: string , email: string, username : string, profile_photo: string}) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
 
  const [user, setUser] = useState<{ userId: string; name: string; email: string, username : string, profile_photo: string } | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (user: { userId: string; name: string, email: string, username : string, profile_photo: string }) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    api.get('/logout');
    navigate('/login');
   
  };

  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
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