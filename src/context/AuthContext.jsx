import React, { createContext, useContext, useState, useCallback } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('saliheenUser') || 'null'));

  const login = useCallback(async (email, password) => {
    const { data } = await API.post('/api/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('saliheenUser', JSON.stringify(data));
    return data;
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    const { data } = await API.post('/api/auth/register', { name, email, password, phone });
    setUser(data);
    localStorage.setItem('saliheenUser', JSON.stringify(data));
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('saliheenUser');
  }, []);

  const setupAdmin = useCallback(async (name, email, password) => {
    const { data } = await API.post('/api/auth/setup-admin', { name, email, password });
    setUser(data);
    localStorage.setItem('saliheenUser', JSON.stringify(data));
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setupAdmin, isAdmin: user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
