import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

interface User {
  userId: string;
  role: 'admin' | 'user';
  email?: string;
  name?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  isUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ userId: payload.userId, role: payload.role, email: payload.email, name: payload.name });
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin: user?.role === 'admin', isUser: user?.role === 'user' }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
