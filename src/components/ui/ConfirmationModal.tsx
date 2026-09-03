'use client';

import React, { useEffect } from 'react';
import { Trash2, X, AlertTriangle, Info } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: React.ReactNode;
  itemName?: string;
  itemType?: string;
  warningNote?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  type?: 'danger' | 'warning' | 'info';
  confirmButtonColor?: string;
  zIndex?: number;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message,
  itemName,
  itemType,
  warningNote,
  confirmText,
  cancelText = 'Cancel',
  isLoading = false,
  icon,
  type = 'danger',
  confirmButtonColor,
  zIndex = 100000,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  // Colors & icons based on type
  const isDanger = type === 'danger';
  const isWarning = type === 'warning';

  const badgeBg = isDanger ? '#fee2e2' : isWarning ? '#fef3c7' : '#e0f2fe';
  const badgeColor = isDanger ? '#ef4444' : isWarning ? '#d97706' : '#0284c7';
  const defaultBtnColor = isDanger ? '#dc2626' : isWarning ? '#d97706' : '#0284c7';
  const finalBtnColor = confirmButtonColor || defaultBtnColor;

  const defaultIcon = isDanger ? (
    <Trash2 size={24} />
  ) : isWarning ? (
    <AlertTriangle size={24} />
  ) : (
    <Info size={24} />
  );

  const defaultConfirmText = isDanger
    ? (itemType ? `Yes, Delete ${itemType}` : 'Yes, Delete')
    : 'Confirm';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '440px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          animation: 'scaleUp 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            color: '#6b7280',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'color 0.15s ease, background-color 0.15s ease',
          }}
        >
          <X size={20} />
        </button>

        {/* Icon Badge */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: badgeBg,
            color: badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          {icon || defaultIcon}
        </div>

        {/* Modal Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            color: 'var(--color-forest, #0f291e)',
            margin: '0 0 0.5rem',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>

        {/* Modal Message */}
        <div
          style={{
            fontSize: '0.88rem',
            color: '#4b5563',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
          }}
        >
          {message ? (
            message
          ) : (
            <p style={{ margin: 0 }}>
              Are you sure you want to delete{' '}
              {itemType ? `${itemType} ` : ''}
              {itemName ? <strong>{itemName}</strong> : 'this item'}?
            </p>
          )}

          {warningNote && (
            <p
              style={{
                margin: '0.75rem 0 0',
                fontSize: '0.82rem',
                color: '#6b7280',
                lineHeight: 1.4,
              }}
            >
              {warningNote}
            </p>
          )}
        </div>

        {/* Buttons Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => onConfirm()}
            disabled={isLoading}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: finalBtnColor,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 0.15s ease, transform 0.1s ease',
              boxShadow: isDanger ? '0 2px 8px rgba(220, 38, 38, 0.25)' : 'none',
            }}
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                {isDanger && <Trash2 size={15} />}
                {confirmText || defaultConfirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
