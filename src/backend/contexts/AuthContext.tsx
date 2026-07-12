"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { account } from "@backend/services/appwrite";
import { Models, OAuthProvider } from "appwrite";

interface AuthContextType {
  isLoggedIn: boolean;
  user: Models.User<Models.Preferences> | null;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: (successRedirect?: string) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has an active session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        setIsLoggedIn(true);
      } catch (error) {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    // If a session already exists, delete it first before creating a new one
    try {
      await account.deleteSession('current');
    } catch {
      // No active session — that's fine, continue
    }
    await account.createEmailPasswordSession(email, pass);
    const currentUser = await account.get();
    setUser(currentUser);
    setIsLoggedIn(true);
  };

  const loginWithGoogle = (successRedirect?: string) => {
    // Appwrite Google OAuth
    // After OAuth, redirect back to the login page so AuthLoginPage
    // can detect the active session and route the user appropriately.
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const successUrl = successRedirect
      ? `${origin}${successRedirect}`
      : `${origin}/login`;
    account.createOAuth2Session(
      OAuthProvider.Google,
      successUrl,         // Success: back to login or a specific page
      `${origin}/login`   // Failure: back to login page
    );
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, loginWithGoogle, logout, isLoading }}>
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
