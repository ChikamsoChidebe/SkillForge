import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('devchain_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (userData) => {
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      name: userData.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      joinedAt: new Date().toISOString(),
      totalEntries: 0,
      badges: [],
      streak: 0
    };
    
    setUser(newUser);
    localStorage.setItem('devchain_user', JSON.stringify(newUser));
    return newUser;
  };

  const login = async (credentials) => {
    // In a real app, this would validate against a backend
    const users = JSON.parse(localStorage.getItem('devchain_users') || '[]');
    const user = users.find(u => 
      u.email === credentials.email || u.username === credentials.username
    );
    
    if (user) {
      setUser(user);
      localStorage.setItem('devchain_user', JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('devchain_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('devchain_user', JSON.stringify(updatedUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('devchain_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      users[userIndex] = updatedUser;
      localStorage.setItem('devchain_users', JSON.stringify(users));
    }
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};