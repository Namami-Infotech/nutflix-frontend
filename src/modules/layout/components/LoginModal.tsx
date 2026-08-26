'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, ArrowRight, CheckCircle, LogOut, Key } from 'lucide-react';
import { loginUser, registerUser, setCookie, deleteCookie, logoutUser, getAuthToken, getRefreshToken, getUserFromCookie, setUserCookie } from '@/lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  promptMessage?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess, promptMessage }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [tokenInfo, setTokenInfo] = useState<{ accessToken?: string; refreshToken?: string; accessTokenExpiresIn?: string; refreshTokenExpiresIn?: string } | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAccessToken = getAuthToken();
      const storedUser = getUserFromCookie();
      if (storedAccessToken && storedUser) {
        try {
          setUserData(storedUser);
          setTokenInfo({
            accessToken: storedAccessToken,
            refreshToken: getRefreshToken() || '',
            accessTokenExpiresIn: '1d',
            refreshTokenExpiresIn: '7d',
          });
          setIsLoggedIn(true);
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!emailInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Email and password are required.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'login') {
        const response = await loginUser({ email: emailInput.trim(), password: passwordInput });
        if (response.success && response.data) {
          const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn, user } = response.data;

          if (typeof window !== 'undefined') {
            setCookie('accessToken', accessToken);
            setCookie('nutflix_accessToken', accessToken);
            setCookie('refreshToken', refreshToken);
            setCookie('nutflix_refreshToken', refreshToken);
            setUserCookie(user);
          }

          setIsLoggedIn(true);
          setUserData(user);
          setTokenInfo({ accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn });
          setSuccessMsg(response.message || 'Login successful!');
          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
            }, 500);
          }
        } else {
          setErrorMsg(response.message || 'Invalid login credentials.');
        }
      } else {
        const response = await registerUser({
          name: nameInput.trim(),
          email: emailInput.trim(),
          password: passwordInput,
        });

        if (response.success && response.data) {
          const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn, user } = response.data;

          if (typeof window !== 'undefined') {
            setCookie('accessToken', accessToken);
            setCookie('nutflix_accessToken', accessToken);
            setCookie('refreshToken', refreshToken);
            setCookie('nutflix_refreshToken', refreshToken);
            setUserCookie(user);
          }

          setIsLoggedIn(true);
          setUserData(user);
          setTokenInfo({ accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn });
          setSuccessMsg('Account created successfully!');
          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
            }, 500);
          }
        } else {
          setErrorMsg(response.message || 'Failed to create account.');
        }
      }
    } catch (err) {
      setErrorMsg('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUserData(null);
    setTokenInfo(null);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(22, 35, 26, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '460px',
          width: '100%',
          padding: '2rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            backgroundColor: 'var(--color-cream-light)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-forest)',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {isLoggedIn ? (
          /* Logged In State */
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 157, 102, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '2px solid var(--color-gold)',
              }}
            >
              <User size={32} color="var(--color-forest)" />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.2rem' }}>
              {userData?.name || 'Customer'}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              Logged in as <strong style={{ color: 'var(--color-forest)' }}>{userData?.email || emailInput}</strong>
            </p>

            {/* Token Info Box */}
            <div
              style={{
                backgroundColor: '#f9f6f0',
                borderRadius: '16px',
                padding: '1rem 1.2rem',
                textAlign: 'left',
                marginBottom: '1.2rem',
                fontSize: '0.82rem',
                color: 'var(--color-forest)',
                border: '1px solid rgba(200, 157, 102, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                <Key size={16} color="var(--color-gold)" />
                <span>JWT Authentication Tokens:</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px dashed #e2d8c9' }}>
                <span>Access Token Expiry:</span>
                <strong style={{ color: 'green' }}>1 Day (1d)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px dashed #e2d8c9' }}>
                <span>Refresh Token Expiry:</span>
                <strong style={{ color: 'darkblue' }}>7 Days (7d)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.3rem' }}>
                <span>Role:</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{userData?.role || 'admin'}</span>
              </div>
            </div>

            {/* Business info badge */}
            <div
              style={{
                backgroundColor: 'rgba(22, 35, 26, 0.04)',
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                textAlign: 'left',
                marginBottom: '1.2rem',
                fontSize: '0.78rem',
                color: 'var(--color-forest)',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>Brand: NUTFLIX</div>
              <div>Address: 43, KARAYA ROAD, KOLKATA - 700017</div>
              <div>Phone/WhatsApp: 98300-55527</div>
              <div>GSTIN: 19ADZPG6957G3ZN</div>
            </div>

            <button
              onClick={handleLogout}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: '#e0d5c5' }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Login / Register Forms */
          <div>
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.6rem',
                }}
              >
                <User size={22} color="var(--color-gold)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.2rem' }}>
                {activeTab === 'login' ? 'Sign In to NUTFLIX' : 'Create Account'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {activeTab === 'login' ? 'Welcome back! Please enter your details.' : 'Join NUTFLIX for fresh & premium dry fruits.'}
              </p>
            </div>

            {/* Context Prompt Message (e.g. Add to Cart / Checkout Auth required) */}
            {promptMessage && (
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  lineHeight: '1.4',
                }}
              >
                <span>🔒</span>
                <span>{promptMessage}</span>
              </div>
            )}

            {/* Tab Switcher */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--color-cream-light)',
                padding: '4px',
                borderRadius: '30px',
                marginBottom: '1.2rem',
              }}
            >
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '25px',
                  border: 'none',
                  backgroundColor: activeTab === 'login' ? '#ffffff' : 'transparent',
                  color: activeTab === 'login' ? 'var(--color-forest)' : 'var(--color-text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'login' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '25px',
                  border: 'none',
                  backgroundColor: activeTab === 'register' ? '#ffffff' : 'transparent',
                  color: activeTab === 'register' ? 'var(--color-forest)' : 'var(--color-text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'register' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div style={{ backgroundColor: '#fde8e8', color: '#c53030', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ backgroundColor: '#e6fffa', color: '#234e52', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                ✅ {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeTab === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem 0.7rem 2.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem 0.7rem 2.5rem',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem 0.7rem 2.5rem',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '0.2rem',
                  padding: '0.8rem',
                  borderRadius: '12px',
                }}
              >
                <span>{loading ? 'Authenticating...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
