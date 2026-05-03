import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('panchayat_token'));
  const [loading, setLoading] = useState(true);

  // Set axios auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('panchayat_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('panchayat_token');
    }
  }, [token]);

  // Verify token on load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await axios.get('/api/auth/me');
        setUser(data.user);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await axios.post('/api/auth/register', formData);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
