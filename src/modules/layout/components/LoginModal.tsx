'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle,
  LogOut,
  Key,
  Clock,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  sendOtpApi,
  verifyOtpSignupApi,
  verifyOtpLoginApi,
  setCookie,
  logoutUser,
  getAuthToken,
  getRefreshToken,
  getUserFromCookie,
  setUserCookie,
} from '@/lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  promptMessage?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess, promptMessage }) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [tokenInfo, setTokenInfo] = useState<{
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresIn?: string;
    refreshTokenExpiresIn?: string;
  } | null>(null);

  // Form Inputs
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // OTP State & 5-Minute Timer
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Status & Loading
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Client mounted guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check login state on mount & when modal opens
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
          // ignore
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    }
  }, [isOpen]);

  // Live countdown timer for OTP (5 minutes) and Resend cooldown
  useEffect(() => {
    if (otpCountdown > 0 || resendCooldown > 0) {
      timerRef.current = setTimeout(() => {
        if (otpCountdown > 0) setOtpCountdown((prev) => prev - 1);
        if (resendCooldown > 0) setResendCooldown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [otpCountdown, resendCooldown]);

  if (!isOpen || !mounted) return null;

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset tab state
  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
    setOtpSent(false);
    setOtpInput('');
    setOtpCountdown(0);
    setResendCooldown(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Clean phone input
  const cleanPhone = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 10);
  };

  // Handle Send OTP (Signup or Login)
  const handleSendOtp = async (purpose: 'signup' | 'login') => {
    setErrorMsg('');
    setSuccessMsg('');

    const cleanedPhone = cleanPhone(phoneInput);
    if (!cleanedPhone || cleanedPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (purpose === 'signup') {
      if (!nameInput.trim()) {
        setErrorMsg('Please enter your full name before verifying mobile.');
        return;
      }
      if (!emailInput.trim() || !emailInput.includes('@')) {
        setErrorMsg('Please enter a valid email address before verifying mobile.');
        return;
      }
    }

    setSendingOtp(true);

    try {
      const response = await sendOtpApi({
        phone: cleanedPhone,
        purpose,
        name: nameInput.trim(),
        email: emailInput.trim(),
      });

      if (response.success) {
        setOtpSent(true);
        setOtpInput('');
        const remainingTime = response.data?.expiresInSeconds || 300;
        setOtpCountdown(remainingTime);
        setResendCooldown(60); // 60s resend cooldown
        setSuccessMsg(response.message || `OTP sent to +91 ${cleanedPhone}.`);
      } else {
        setErrorMsg(response.message || 'Failed to send OTP. Please check your number.');
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || 'Error sending OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle Form Submit (OTP Verify & Complete Auth)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanedPhone = cleanPhone(phoneInput);

    // SIGNUP FLOW WITH OTP
    if (activeTab === 'register') {
      if (!nameInput.trim()) {
        setErrorMsg('Full Name is required.');
        return;
      }
      if (!emailInput.trim()) {
        setErrorMsg('Email Address is required.');
        return;
      }
      if (!cleanedPhone || cleanedPhone.length !== 10) {
        setErrorMsg('Valid 10-digit mobile number is required.');
        return;
      }
      if (!otpSent) {
        setErrorMsg('Please click "Verify" to get an OTP on your mobile number.');
        return;
      }
      if (!otpInput.trim() || otpInput.trim().length < 4) {
        setErrorMsg('Please enter the OTP received on your mobile.');
        return;
      }

      setLoading(true);
      try {
        const response = await verifyOtpSignupApi({
          name: nameInput.trim(),
          email: emailInput.trim(),
          phone: cleanedPhone,
          otp: otpInput.trim(),
        });

        if (response.success && response.data) {
          const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn, user } = response.data;
          if (typeof window !== 'undefined') {
            setCookie('accessToken', accessToken);
            setCookie('nutflix_accessToken', accessToken);
            setCookie('refreshToken', refreshToken);
            setCookie('nutflix_refreshToken', refreshToken);
            setUserCookie(user);
            try {
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('nutflix_accessToken', accessToken);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('nutflix_refreshToken', refreshToken);
              localStorage.setItem('nutflix_user', JSON.stringify(user));
              localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {}
            window.dispatchEvent(new Event('authChange'));
            window.dispatchEvent(new Event('storage'));
          }
          setIsLoggedIn(true);
          setUserData(user);
          setTokenInfo({ accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn });
          setSuccessMsg(response.message || 'Account created and verified successfully!');
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            }
            onClose();
          }, 700);
        } else {
          setErrorMsg(response.message || 'Verification failed. Please try again.');
        }
      } catch (err: any) {
        setErrorMsg(err?.response?.data?.message || err?.message || 'An error occurred during account creation.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // LOGIN FLOW - STRICTLY PHONE OTP ONLY
    if (activeTab === 'login') {
      if (!cleanedPhone || cleanedPhone.length !== 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!otpSent) {
        setErrorMsg('Please click "Send OTP" to receive your login code.');
        return;
      }
      if (!otpInput.trim() || otpInput.trim().length < 4) {
        setErrorMsg('Please enter the OTP received on your phone.');
        return;
      }

      setLoading(true);
      try {
        const response = await verifyOtpLoginApi({
          phone: cleanedPhone,
          otp: otpInput.trim(),
        });

        if (response.success && response.data) {
          const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn, user } = response.data;
          if (typeof window !== 'undefined') {
            setCookie('accessToken', accessToken);
            setCookie('nutflix_accessToken', accessToken);
            setCookie('refreshToken', refreshToken);
            setCookie('nutflix_refreshToken', refreshToken);
            setUserCookie(user);
            try {
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('nutflix_accessToken', accessToken);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('nutflix_refreshToken', refreshToken);
              localStorage.setItem('nutflix_user', JSON.stringify(user));
              localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {}
            window.dispatchEvent(new Event('authChange'));
            window.dispatchEvent(new Event('storage'));
          }
          setIsLoggedIn(true);
          setUserData(user);
          setTokenInfo({ accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn });
          setSuccessMsg(response.message || 'Login successful!');
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            }
            onClose();
          }, 700);
        } else {
          setErrorMsg(response.message || 'Invalid or expired OTP.');
        }
      } catch (err: any) {
        setErrorMsg(err?.response?.data?.message || err?.message || 'An error occurred during sign in.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUserData(null);
    setTokenInfo(null);
    setErrorMsg('');
    setSuccessMsg('');
    setOtpSent(false);
    setOtpInput('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(22, 35, 26, 0.68)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '480px',
          width: '100%',
          padding: '2.2rem 2rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          border: '1px solid var(--color-border)',
          maxHeight: '92vh',
          overflowY: 'auto',
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
            transition: 'background 0.2s',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {isLoggedIn ? (
          /* Logged In State Screen */
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 157, 102, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '2px solid var(--color-gold)',
              }}
            >
              <User size={34} color="var(--color-forest)" />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.2rem' }}>
              {userData?.name || 'Valued Customer'}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              Logged in as <strong style={{ color: 'var(--color-forest)' }}>{userData?.phone ? `+91 ${userData.phone}` : userData?.email}</strong>
            </p>

            {/* Token Info Box */}
            <div
              style={{
                backgroundColor: '#fbf8f2',
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
                <span>JWT Secure Session Tokens:</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px dashed #e2d8c9' }}>
                <span>Access Token Expiry:</span>
                <strong style={{ color: '#15803d' }}>1 Day (1d)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px dashed #e2d8c9' }}>
                <span>Refresh Token Expiry:</span>
                <strong style={{ color: '#1d4ed8' }}>7 Days (7d)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.3rem' }}>
                <span>Role:</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{userData?.role || 'user'}</span>
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
          /* Authentication Forms */
          <div>
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
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
                <ShieldCheck size={24} color="var(--color-gold)" />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.2rem' }}>
                {activeTab === 'login' ? 'Mobile Sign In' : 'Create an Account'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                {activeTab === 'login'
                  ? 'Enter your mobile number to receive a secure login OTP.'
                  : 'Enter your details & verify your mobile with OTP.'}
              </p>
            </div>

            {/* Context Prompt Message */}
            {promptMessage && (
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
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

            {/* Primary Tab Switcher */}
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
                onClick={() => switchTab('login')}
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
                Sign In (Phone)
              </button>
              <button
                type="button"
                onClick={() => switchTab('register')}
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

            {/* Status Notifications */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  lineHeight: '1.35',
                }}
              >
                <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  lineHeight: '1.35',
                }}
              >
                <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* SIGNUP TAB */}
              {activeTab === 'register' && (
                <>
                  {/* Name Input */}
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
                        disabled={otpSent}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem 0.7rem 2.5rem',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.88rem',
                          outline: 'none',
                          backgroundColor: otpSent ? '#f9fafb' : '#ffffff',
                        }}
                      />
                    </div>
                  </div>

                  {/* Email Input */}
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
                        disabled={otpSent}
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem 0.7rem 2.5rem',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.88rem',
                          outline: 'none',
                          backgroundColor: otpSent ? '#f9fafb' : '#ffffff',
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone Input with VERIFY Button */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                      Phone Number *
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '0.8rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--color-forest)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                          }}
                        >
                          <Phone size={14} color="var(--color-text-muted)" />
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(cleanPhone(e.target.value))}
                          required
                          disabled={otpSent}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1rem 0.7rem 3.6rem',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.88rem',
                            outline: 'none',
                            backgroundColor: otpSent ? '#f9fafb' : '#ffffff',
                          }}
                        />
                      </div>

                      {/* Verify / Send OTP Button next to Phone */}
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={() => handleSendOtp('signup')}
                          disabled={sendingOtp || cleanPhone(phoneInput).length !== 10}
                          style={{
                            backgroundColor: 'var(--color-forest)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0 1.2rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: cleanPhone(phoneInput).length === 10 ? 'pointer' : 'not-allowed',
                            opacity: cleanPhone(phoneInput).length === 10 ? 1 : 0.6,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                          }}
                        >
                          {sendingOtp ? 'Sending...' : 'Verify'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpInput('');
                            setResendCooldown(0);
                          }}
                          style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '12px',
                            padding: '0 0.8rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  {/* OTP Input Section (Shown after clicking Verify) */}
                  {otpSent && (
                    <div
                      style={{
                        backgroundColor: '#faf7f2',
                        borderRadius: '14px',
                        padding: '1.1rem',
                        border: '1px solid rgba(200, 157, 102, 0.35)',
                        animation: 'fadeIn 0.2s ease-in',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                          Enter 6-Digit OTP *
                        </label>
                      </div>

                      <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
                        <Key size={16} color="var(--color-gold)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit OTP code"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          required
                          autoFocus
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                            borderRadius: '10px',
                            border: '1px solid var(--color-border)',
                            fontSize: '1rem',
                            letterSpacing: '3px',
                            fontWeight: 700,
                            outline: 'none',
                            backgroundColor: '#ffffff',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          OTP sent to +91 {cleanPhone(phoneInput)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSendOtp('signup')}
                          disabled={resendCooldown > 0 || sendingOtp}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: resendCooldown > 0 ? '#9ca3af' : 'var(--color-forest)',
                            fontWeight: 700,
                            cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 0,
                          }}
                        >
                          <RefreshCw size={12} />
                          <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend OTP'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || (otpSent && otpInput.length < 4)}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: '0.4rem',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      opacity: otpSent && otpInput.length < 4 ? 0.6 : 1,
                    }}
                  >
                    <span>{loading ? 'Creating Account...' : otpSent ? 'Verify & Create Account' : 'Continue'}</span>
                    <ArrowRight size={18} />
                  </button>
                </>
              )}

              {/* LOGIN TAB - 100% PHONE + OTP ONLY */}
              {activeTab === 'login' && (
                <>
                  {/* Phone Input with Send OTP button */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                      Registered Mobile Number *
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '0.8rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--color-forest)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                          }}
                        >
                          <Phone size={14} color="var(--color-text-muted)" />
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(cleanPhone(e.target.value))}
                          required
                          disabled={otpSent}
                          style={{
                            width: '100%',
                            padding: '0.7rem 1rem 0.7rem 3.6rem',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.88rem',
                            outline: 'none',
                            backgroundColor: otpSent ? '#f9fafb' : '#ffffff',
                          }}
                        />
                      </div>

                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={() => handleSendOtp('login')}
                          disabled={sendingOtp || cleanPhone(phoneInput).length !== 10}
                          style={{
                            backgroundColor: 'var(--color-forest)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0 1.2rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: cleanPhone(phoneInput).length === 10 ? 'pointer' : 'not-allowed',
                            opacity: cleanPhone(phoneInput).length === 10 ? 1 : 0.6,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                          }}
                        >
                          {sendingOtp ? 'Sending...' : 'Send OTP'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpInput('');
                            setOtpCountdown(0);
                            setResendCooldown(0);
                          }}
                          style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '12px',
                            padding: '0 0.8rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  {/* OTP Input Section for Login */}
                  {otpSent && (
                    <div
                      style={{
                        backgroundColor: '#faf7f2',
                        borderRadius: '14px',
                        padding: '1.1rem',
                        border: '1px solid rgba(200, 157, 102, 0.35)',
                        animation: 'fadeIn 0.2s ease-in',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                          Enter Login OTP *
                        </label>
                      </div>

                      <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
                        <Key size={16} color="var(--color-gold)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit OTP code"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          required
                          autoFocus
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                            borderRadius: '10px',
                            border: '1px solid var(--color-border)',
                            fontSize: '1rem',
                            letterSpacing: '3px',
                            fontWeight: 700,
                            outline: 'none',
                            backgroundColor: '#ffffff',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          OTP sent to +91 {cleanPhone(phoneInput)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSendOtp('login')}
                          disabled={resendCooldown > 0 || sendingOtp}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: resendCooldown > 0 ? '#9ca3af' : 'var(--color-forest)',
                            fontWeight: 700,
                            cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 0,
                          }}
                        >
                          <RefreshCw size={12} />
                          <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend OTP'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !otpSent || otpInput.length < 4}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: '0.3rem',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      opacity: !otpSent || otpInput.length < 4 ? 0.6 : 1,
                    }}
                  >
                    <span>{loading ? 'Authenticating...' : 'Verify & Sign In'}</span>
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
