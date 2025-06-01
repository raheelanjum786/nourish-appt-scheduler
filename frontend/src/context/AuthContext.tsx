import React, { createContext, useContext, useState, useEffect } from "react";
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
          setAuthToken(storedToken);
          const userData = await users.getCurrentUser();
          setUser(userData);

          setupTokenExpirationTimer();
        } catch (err: any) {
          console.error("Error loading user:", err);
          if (err.response && err.response.status === 401) {
            console.log("Token invalid or expired, logging out.");
            localStorage.removeItem("token");
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
          } else {
            console.log(
              "Non-authentication error loading user, keeping token."
            );
            setUser(null);
            setIsAuthenticated(false);
          }
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
      const data = await auth.login(email, password);

      localStorage.setItem("token", data.token);

      setToken(data.token);
      setUser(data);
      setIsAuthenticated(true);

      setAuthToken(data.token);

      setupTokenExpirationTimer();
    } catch (err) {
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
      const data = await auth.register(
        userData.name,
        userData.email,
        userData.password
      );

      localStorage.setItem("token", data.token);

      setToken(data.token);
      setUser(data);
      setIsAuthenticated(true);

      setAuthToken(data.token);
    } catch (err) {
      setError(err.message || "Failed to register");
      console.error("Registration error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    if (tokenTimer) {
      clearTimeout(tokenTimer);
      setTokenTimer(null);
    }

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
