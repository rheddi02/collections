"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const sessionExpiry = localStorage.getItem('sessionExpiry');
        
        if (savedUser && sessionExpiry) {
          const expiryTime = parseInt(sessionExpiry);
          const currentTime = Date.now();
          
          if (currentTime < expiryTime) {
            // Session is still valid
            setUser(JSON.parse(savedUser));
          } else {
            // Session expired, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('sessionExpiry');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('sessionExpiry');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Replace this with your actual authentication logic
      // For now, I'll create a simple demo that accepts any email/password
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo: Accept any email/password for now
      // You can replace this with actual API calls
      if (email && password) {
        const userData: User = {
          id: Date.now().toString(),
          email: email,
          name: email.split('@')[0]
        };
        
        // Set session expiry (24 hours from now)
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('sessionExpiry', expiryTime.toString());
        
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
