'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Check, Loader2, AlertCircle } from 'lucide-react';
import { Address, createAddress, updateAddress } from '@/lib/api';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: Address | null;
  onSaveSuccess: (address: Address) => void;
  defaultName?: string;
  defaultPhone?: string;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  addressToEdit,
  onSaveSuccess,
  defaultName = '',
  defaultPhone = '',
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (addressToEdit) {
        setFullName(addressToEdit.fullName || '');
        setPhone(addressToEdit.phone || '');
        setStreetAddress(addressToEdit.streetAddress || '');
        setCity(addressToEdit.city || '');
        setState(addressToEdit.state || '');
        setPostalCode(addressToEdit.postalCode || '');
        setIsDefault(Boolean(addressToEdit.isDefault));
      } else {
        setFullName(defaultName || '');
        setPhone(defaultPhone || '');
        setStreetAddress('');
        setCity('');
        setState('');
        setPostalCode('');
        setIsDefault(false);
      }
    }
  }, [isOpen, addressToEdit, defaultName, defaultPhone]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim() || !streetAddress.trim() || !city.trim() || !postalCode.trim()) {
      setErrorMsg('Please fill all required fields marked with *');
      return;
    }

    setLoading(true);
    try {
      if (addressToEdit) {
        const updated = await updateAddress(addressToEdit.id, {
          fullName: fullName.trim(),
          phone: phone.trim(),
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          isDefault,
        });

        if (updated) {
          onSaveSuccess(updated);
          onClose();
        } else {
          setErrorMsg('Failed to update address. Please try again.');
        }
      } else {
        const created = await createAddress({
          fullName: fullName.trim(),
          phone: phone.trim(),
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          isDefault,
        });

        if (created) {
          onSaveSuccess(created);
          onClose();
        } else {
          setErrorMsg('Failed to save address. Please try again.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || 'Error processing address request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece4', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 157, 102, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid var(--color-gold)',
              }}
            >
              <MapPin size={20} color="var(--color-forest)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-forest)', margin: 0 }}>
                {addressToEdit ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.15rem 0 0 0' }}>
                Enter accurate delivery details for swift shipping
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              color: '#b91c1c',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.2rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.35rem' }}>
                Recipient Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  outline: 'none',
                  fontSize: '0.92rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.35rem' }}>
                Contact Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  outline: 'none',
                  fontSize: '0.92rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.35rem' }}>
              Street Address / House / Flat / Area *
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Flat 402, Sunshine Heights, 12th Cross Road"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.95rem',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                outline: 'none',
                fontSize: '0.92rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.9rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.35rem' }}>
                City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  outline: 'none',
                  fontSize: '0.92rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.35rem' }}>
                State
              </label>
              <input
                type="text"
                placeholder="e.g. Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  outline: 'none',
                  fontSize: '0.92rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.35rem' }}>
                PIN / Postal Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 400001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  outline: 'none',
                  fontSize: '0.92rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem' }}>
            <input
              type="checkbox"
              id="isDefaultModalCheck"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-forest)', cursor: 'pointer' }}
            />
            <label htmlFor="isDefaultModalCheck" style={{ fontSize: '0.85rem', color: '#444', fontWeight: 600, cursor: 'pointer' }}>
              Set as primary default delivery address
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '0.8rem', borderTop: '1px solid #f1ece4', paddingTop: '1.2rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--color-forest)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(30, 77, 43, 0.2)',
              }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              <span>{addressToEdit ? 'Update Address' : 'Save & Select Address'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
