import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await apiService.user.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiService.auth.login(email, password);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await apiService.auth.register(userData);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const updatedUser = await apiService.user.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      console.error("Update profile failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
