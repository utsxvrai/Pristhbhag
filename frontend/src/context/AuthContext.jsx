import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const id = localStorage.getItem('userId');
      return id ? { id } : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const signIn = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData && userData.id) localStorage.setItem('userId', userData.id);
    setIsLoggedIn(true);
    setUser(userData || null);
  };

  const signOut = () => {
    const token = localStorage.getItem('token');
    // call backend signout but don't await here
    fetch('/api/v1/user/signout', { method: 'POST', headers: { Authorization: token ? `Bearer ${token}` : '' } }).catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
