import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar: string;
  bio?: string;
  favoriteGenres?: string[];
  booksRead?: number;
  readingGoal?: number;
  badges?: any[];
  followersCount?: number;
  followingCount?: number;
  clubsCount?: number;
  currentlyReading?: any[];
  readBooks?: any[];
  wantToRead?: any[];
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await api.auth.checkStatus();
      if (result.isAuthenticated && result.user) {
        setUser(result.user);
      }
    } catch (error) {
      // Backend not available or not authenticated - this is okay
      console.log('Backend not available or user not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await api.auth.login(email, password);
      if (result.user) {
        setUser(result.user);
        // Update streak on login
        try {
          await api.user.updateStreak();
        } catch (err) {
          console.log('Failed to update streak:', err);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }) => {
    try {
      const result = await api.auth.register(userData);
      if (result.user) {
        setUser(result.user);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const loginWithGoogle = () => {
    api.auth.googleLogin();
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginWithGoogle,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}