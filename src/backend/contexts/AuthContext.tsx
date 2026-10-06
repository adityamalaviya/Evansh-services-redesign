"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { account, ID } from "@/lib/appwrite/client";
import { Models, OAuthProvider } from "appwrite";
import { api, clearAuthCache } from "@/lib/api";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: Models.User<Models.Preferences> | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithOAuth: (provider: OAuthProvider) => void;
  logout: () => Promise<void>;
  checkIsAdmin: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        setIsLoggedIn(true);
        const adminStatus = await api.checkAdminStatus();
        setIsAdmin(adminStatus);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    clearAuthCache();
    try {
      await account.deleteSession('current');
    } catch {
      // No active session — fine
    }
    await account.createEmailPasswordSession(email.trim(), pass);
    const currentUser = await account.get();
    setUser(currentUser);
    setIsLoggedIn(true);
    const adminStatus = await api.checkAdminStatus();
    setIsAdmin(adminStatus);
    return adminStatus;
  };

  const register = async (name: string, email: string, pass: string) => {
    clearAuthCache();
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
    setIsAdmin(false);
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

  const checkIsAdmin = async (): Promise<boolean> => {
    const status = await api.checkAdminStatus();
    setIsAdmin(status);
    return status;
  };

  const logout = async () => {
    clearAuthCache();
    try {
      await account.deleteSession('current');
    } catch {
      // already logged out
    }
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, register, loginWithGoogle, loginWithOAuth, logout, checkIsAdmin, isLoading }}>
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