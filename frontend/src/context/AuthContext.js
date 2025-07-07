import React, { createContext, useState, useEffect } from 'react';
import axios from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      // Fetch user data by trying to access a protected endpoint
      axios.get('http://localhost:8000/api/incidents/')
        .then(() => {
          const userData = JSON.parse(localStorage.getItem('user'));
          setUser(userData);
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
         email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || { error: 'Registration failed' } 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout/');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post('http://localhost:8000/api/forgot-password/', { email });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Request failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;