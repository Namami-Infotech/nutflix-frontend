'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuthToken, getUserFromCookie, logoutUser } from '@/lib/api';
import { LoginModal } from '@/modules/layout/components/LoginModal';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any;
  loginModalOpen: boolean;
  modalPrompt?: string;
  openLoginModal: (callback?: () => void, prompt?: string) => void;
  closeLoginModal: () => void;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalPrompt, setModalPrompt] = useState<string | undefined>(undefined);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  const checkAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      const storedUser = getUserFromCookie();
      if (token && storedUser) {
        setIsLoggedIn(true);
        setUser(storedUser);
        return true;
      }
      setIsLoggedIn(false);
      setUser(null);
      return false;
    }
    return false;
  }, []);

  useEffect(() => {
    checkAuth();
    const handleAuthEvent = () => {
      checkAuth();
    };
    window.addEventListener('authChange', handleAuthEvent);
    window.addEventListener('storage', handleAuthEvent);
    return () => {
      window.removeEventListener('authChange', handleAuthEvent);
      window.removeEventListener('storage', handleAuthEvent);
    };
  }, [checkAuth]);

  const openLoginModal = useCallback((callback?: () => void, prompt?: string) => {
    setModalPrompt(prompt);
    setOnSuccessCallback(() => (callback ? callback : null));
    setLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setLoginModalOpen(false);
    setModalPrompt(undefined);
    setOnSuccessCallback(null);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    checkAuth();
    setLoginModalOpen(false);
    if (onSuccessCallback) {
      const cb = onSuccessCallback;
      setOnSuccessCallback(null);
      cb();
    }
  }, [checkAuth, onSuccessCallback]);

  const logout = useCallback(async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        loginModalOpen,
        modalPrompt,
        openLoginModal,
        closeLoginModal,
        logout,
        checkAuth,
      }}
    >
      {children}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
        promptMessage={modalPrompt}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
