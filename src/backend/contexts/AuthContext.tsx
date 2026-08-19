"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/api/client/apiFetch";

export type AuthUser = {
  $id?: string;
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
};

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithOAuth: (provider: string) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await apiFetch<AuthUser>("/auth/me");
        setUser(currentUser);
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    const currentUser = await apiFetch<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: pass }),
    });
    setUser(currentUser);
    setIsLoggedIn(true);
  };

  const loginWithGoogle = () => {
    loginWithOAuth("google");
  };

  const loginWithOAuth = (provider: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const bffBase = process.env.NEXT_PUBLIC_BFF_URL ?? "http://localhost:3001";
    // Redirect through BFF OAuth endpoint
    window.location.href = `${bffBase}/auth/oauth/${provider}?redirect=${encodeURIComponent(`${origin}/auth/oauth-callback`)}`;
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout network errors
    }
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, loginWithGoogle, loginWithOAuth, logout, isLoading }}>
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