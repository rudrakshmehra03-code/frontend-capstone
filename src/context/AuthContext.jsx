import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('orbital_user', null);

  const login = (credentials) => {
    // Mock authentication
    if (credentials.username && credentials.password) {
      setUser({
        id: Date.now().toString(),
        username: credentials.username,
        role: 'commander',
        clearanceLevel: 5,
        token: 'mock_jwt_token_8a9f2bc4'
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (userData) => {
    // Mock signup
    if (userData.username && userData.password && userData.password === userData.confirmPassword) {
      setUser({
        id: Date.now().toString(),
        username: userData.username,
        role: 'operator',
        clearanceLevel: 1,
        token: 'mock_jwt_token_new_user'
      });
      return { success: true };
    }
    return { success: false, error: 'Signup validation failed' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
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
