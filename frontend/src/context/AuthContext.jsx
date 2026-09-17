import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { MOCK_USERS } from '../services/mockData';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          // If stored token is an old raw placeholder, refresh it via login
          if (storedToken.startsWith('JWT_TOKEN_DEMO_') || storedToken.startsWith('JWT_TOKEN_')) {
            const parsedUser = JSON.parse(storedUser);
            try {
              const res = await authService.login({
                email: parsedUser.email || 'arif@example.com',
                password: 'password123',
              });
              setToken(res.token);
              setUser(res.user);
              localStorage.setItem('token', res.token);
              localStorage.setItem('user', JSON.stringify(res.user));
              return;
            } catch {
              // If backend not reachable, proceed with stored session
            }
          }
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Attempt default student sign in
          try {
            const res = await authService.login({
              email: 'arif@example.com',
              password: 'password123',
            });
            setToken(res.token);
            setUser(res.user);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
          } catch {
            const defaultStudent = MOCK_USERS[0];
            const defaultToken = 'MOCK_JWT_TOKEN_' + btoa(JSON.stringify(defaultStudent));
            localStorage.setItem('token', defaultToken);
            localStorage.setItem('user', JSON.stringify(defaultStudent));
            setToken(defaultToken);
            setUser(defaultStudent);
          }
        }
      } catch (err) {
        console.error('Error initializing auth state:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      const jwtToken = data.token;
      const userData = data.user;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      const jwtToken = data.token;
      const registeredUser = data.user;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setToken(jwtToken);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  // Helper for quick demo role switcher
  const switchDemoRole = async (role) => {
    const targetUser = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    try {
      const data = await authService.login({
        email: targetUser.email,
        password: 'password123',
      });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch {
      const mockToken = 'MOCK_JWT_TOKEN_' + btoa(JSON.stringify(targetUser));
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(targetUser));
      setToken(mockToken);
      setUser(targetUser);
      return targetUser;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    switchDemoRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
