import React, { createContext, useContext, useState, useEffect } from "react";
// Import specific named exports from the api service
import { auth, users, setAuthToken } from "../services/api";

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
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenTimer, setTokenTimer] = useState<NodeJS.Timeout | null>(null);

  const setupTokenExpirationTimer = () => {
    if (tokenTimer) {
      clearTimeout(tokenTimer);
    }

    const timer = setTimeout(() => {
      logout();
    }, 3600000);

    setTokenTimer(timer);
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        try {
          // Use the imported setAuthToken function directly
          setAuthToken(storedToken);
          // Use the imported users object directly
          const userData = await users.getCurrentUser();
          setUser(userData);

          setupTokenExpirationTimer();
        } catch (err) {
          console.error("Error loading user:", err);
          localStorage.removeItem("token");
          setToken(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    loadUser();

    return () => {
      if (tokenTimer) {
        clearTimeout(tokenTimer);
      }
    };
  }, []);

  useEffect(() => {
    const resetTimerOnActivity = () => {
      if (isAuthenticated) {
        setupTokenExpirationTimer();
      }
    };

    window.addEventListener("click", resetTimerOnActivity);
    window.addEventListener("keypress", resetTimerOnActivity);
    window.addEventListener("scroll", resetTimerOnActivity);
    window.addEventListener("mousemove", resetTimerOnActivity);

    return () => {
      window.removeEventListener("click", resetTimerOnActivity);
      window.removeEventListener("keypress", resetTimerOnActivity);
      window.removeEventListener("scroll", resetTimerOnActivity);
      window.removeEventListener("mousemove", resetTimerOnActivity);
    };
  }, [isAuthenticated]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the imported auth object directly
      const data = await auth.login(email, password);

      // Save token to localStorage
      localStorage.setItem("token", data.token);

      // Update state
      setToken(data.token);
      setUser(data);
      setIsAuthenticated(true);

      // Use the imported setAuthToken function directly
      setAuthToken(data.token);

      // Set up token expiration timer
      setupTokenExpirationTimer();

      // No need to redirect here - this should be handled in the component
    } catch (err: any) {
      setError(err.message || "Failed to login");
      console.error("Login error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the imported auth object directly
      const data = await auth.register(
        userData.name,
        userData.email,
        userData.password
      );

      // Save token to localStorage
      localStorage.setItem("token", data.token);

      // Update state
      setToken(data.token);
      setUser(data);
      setIsAuthenticated(true);

      // Use the imported setAuthToken function directly
      setAuthToken(data.token);

      // No need to redirect here - this should be handled in the component
    } catch (err: any) {
      setError(err.message || "Failed to register");
      console.error("Registration error:", err);
      throw err; // Re-throw the error so the component can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear token timer
    if (tokenTimer) {
      clearTimeout(tokenTimer);
      setTokenTimer(null);
    }

    // Clear token in API service
    apiService.setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
