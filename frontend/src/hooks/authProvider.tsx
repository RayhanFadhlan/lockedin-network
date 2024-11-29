import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: { id: string; name: string } | null;
  login: (user: { id: string; name: string }) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  const login = (user: { id: string; name: string }) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
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