import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const setUserFromToken = useCallback((token) => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ userId: payload.userId, role: payload.role, email: payload.email, name: payload.name });
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserFromToken(token);
    }
    setAuthLoading(false);
  }, [setUserFromToken]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setUserFromToken,
        logout,
        authLoading,
        isAdmin: user?.role === 'admin',
        isUser: user?.role === 'user',
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
