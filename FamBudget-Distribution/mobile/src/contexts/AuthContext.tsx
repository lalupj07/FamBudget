import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  householdId: string;
}

interface Household {
  id: string;
  name: string;
  currency: string;
  timezone: string;
}

interface AuthContextData {
  user: User | null;
  household: Household | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@FamBudget:token');
      const storedUser = await AsyncStorage.getItem('@FamBudget:user');
      const storedHousehold = await AsyncStorage.getItem('@FamBudget:household');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedHousehold) {
          setHousehold(JSON.parse(storedHousehold));
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, member, household: newHousehold } = response.data;

      setToken(newToken);
      setUser(member);
      setHousehold(newHousehold);

      await AsyncStorage.setItem('@FamBudget:token', newToken);
      await AsyncStorage.setItem('@FamBudget:user', JSON.stringify(member));
      await AsyncStorage.setItem('@FamBudget:household', JSON.stringify(newHousehold));

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await api.post('/auth/register', data);
      const { token: newToken, member, household: newHousehold } = response.data;

      setToken(newToken);
      setUser(member);
      setHousehold(newHousehold);

      await AsyncStorage.setItem('@FamBudget:token', newToken);
      await AsyncStorage.setItem('@FamBudget:user', JSON.stringify(member));
      await AsyncStorage.setItem('@FamBudget:household', JSON.stringify(newHousehold));

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setHousehold(null);

    await AsyncStorage.removeItem('@FamBudget:token');
    await AsyncStorage.removeItem('@FamBudget:user');
    await AsyncStorage.removeItem('@FamBudget:household');

    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{ user, household, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

