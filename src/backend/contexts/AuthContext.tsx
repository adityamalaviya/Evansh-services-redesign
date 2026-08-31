"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { account, ID } from "@/lib/appwrite/client";
import { Models, OAuthProvider } from "appwrite";

interface AuthContextType {
  isLoggedIn: boolean;
  user: Models.User<Models.Preferences> | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithOAuth: (provider: OAuthProvider) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
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
    try {
      await account.deleteSession('current');
    } catch {
      // No active session — fine
    }
    await account.createEmailPasswordSession(email.trim(), pass);
    const currentUser = await account.get();
    setUser(currentUser);
    setIsLoggedIn(true);
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      await account.deleteSession('current');
    } catch {
      // No active session — fine
    }
    await account.create({
      userId: ID.unique(),
      email: email.trim(),
      password: pass,
      name: name.trim(),
    });
    await account.createEmailPasswordSession(email.trim(), pass);
    const currentUser = await account.get();
    setUser(currentUser);
    setIsLoggedIn(true);
  };

  const loginWithGoogle = () => {
    loginWithOAuth(OAuthProvider.Google);
  };

  const loginWithOAuth = (provider: OAuthProvider) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    account.createOAuth2Token(
      provider,
      `${origin}/auth/callback`,
      `${origin}/login?error=true`
    );
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, loginWithGoogle, loginWithOAuth, logout, isLoading }}>
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