'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  Send,
  ExternalLink,
  MessageCircle,
  FileText,
  Calendar,
  User,
  Filter,
  Search,
} from 'lucide-react';
import { Enquiry } from '@/types';
import Pagination from '@/components/Pagination';

interface EnquiriesViewProps {
  enquiriesList: Enquiry[];
  searchQuery: string;
  onUpdateStatus: (id: number, status: 'pending' | 'contacted' | 'resolved' | 'closed', adminNotes?: string) => Promise<void> | void;
  onDeleteEnquiry: (id: number) => Promise<void> | void;
}

type EnquiryStatusTab = 'all' | 'pending' | 'contacted' | 'resolved';

export default function EnquiriesView({
  enquiriesList = [],
  searchQuery = '',
  onUpdateStatus,
  onDeleteEnquiry,
}: EnquiriesViewProps) {
  const [statusTab, setStatusTab] = useState<EnquiryStatusTab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Detail Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [modalStatus, setModalStatus] = useState<'pending' | 'contacted' | 'resolved' | 'closed'>('pending');
  const [modalNotes, setModalNotes] = useState('');
  const [savingModal, setSavingModal] = useState(false);

  // Quick Status Updating ID
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const pendingCount = enquiriesList.filter((e) => e.status === 'pending').length;
  const contactedCount = enquiriesList.filter((e) => e.status === 'contacted').length;
  const resolvedCount = enquiriesList.filter((e) => e.status === 'resolved' || e.status === 'closed').length;

  const tabs = [
    { id: 'all' as const, label: 'All Enquiries', count: enquiriesList.length, activeBg: '#0f291e', activeColor: '#fff' },
    { id: 'pending' as const, label: 'Pending / New', count: pendingCount, activeBg: '#d97706', activeColor: '#fff' },
    { id: 'contacted' as const, label: 'Contacted', count: contactedCount, activeBg: '#2563eb', activeColor: '#fff' },
    { id: 'resolved' as const, label: 'Resolved', count: resolvedCount, activeBg: '#059669', activeColor: '#fff' },
  ];

  const handleTabChange = (tabId: EnquiryStatusTab) => {
    setStatusTab(tabId);
    setCurrentPage(1);
  };

  const filteredEnquiries = enquiriesList.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (e.name || '').toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.phone || '').includes(q) ||
      (e.subject || '').toLowerCase().includes(q) ||
      (e.message || '').toLowerCase().includes(q) ||
      (e.customId || '').toLowerCase().includes(q) ||
      (e.adminNotes || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (statusTab === 'all') return true;
    if (statusTab === 'pending') return e.status === 'pending';
    if (statusTab === 'contacted') return e.status === 'contacted';
    if (statusTab === 'resolved') return e.status === 'resolved' || e.status === 'closed';
    return true;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / pageSize) || 1;
  const paginatedEnquiries = filteredEnquiries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openDetailModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setModalStatus(enq.status || 'pending');
    setModalNotes(enq.adminNotes || '');
  };

  const handleSaveModal = async () => {
    if (!selectedEnquiry) return;
    setSavingModal(true);
    try {
      await onUpdateStatus(selectedEnquiry.id, modalStatus, modalNotes);
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: modalStatus, adminNotes: modalNotes } : null));
    } finally {
      setSavingModal(false);
    }
  };

  const handleQuickStatusChange = async (id: number, newStatus: 'pending' | 'contacted' | 'resolved' | 'closed') => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'contacted':
        return {
          bg: '#eff6ff',
          color: '#1d4ed8',
          border: '#bfdbfe',
          icon: Clock,
          label: 'Contacted',
        };
      case 'resolved':
      case 'closed':
        return {
          bg: '#ecfdf5',
          color: '#047857',
          border: '#a7f3d0',
          icon: CheckCircle2,
          label: status === 'closed' ? 'Closed' : 'Resolved',
        };
      case 'pending':
      default:
        return {
          bg: '#fffbeb',
          color: '#b45309',
          border: '#fde68a',
          icon: AlertCircle,
          label: 'Pending',
        };
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const cleanPhoneForWa = (phoneStr: string) => {
    const cleaned = (phoneStr || '').replace(/\D/g, '');
    if (cleaned.length === 10) return `91${cleaned}`;
    return cleaned;
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '1.25rem',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
      }}
    >
      {/* Header & Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          marginBottom: '1.1rem',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#0f291e',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <MessageSquare size={19} color="#d97706" /> Customer Inquiries &amp; Support Messages
          </h3>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
            Showing {paginatedEnquiries.length} of {filteredEnquiries.length} {statusTab === 'all' ? 'total' : statusTab} inquiries.
          </p>
        </div>

        {/* Tab Filters */}
        <div
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            backgroundColor: '#f8fafc',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
          }}
        >
          {tabs.map((tab) => {
            const isActive = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                style={{
                  border: 'none',
                  backgroundColor: isActive ? tab.activeBg : 'transparent',
                  color: isActive ? tab.activeColor : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  padding: '0.38rem 0.8rem',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                    color: isActive ? '#fff' : '#475569',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '10px',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enquiries Table */}
      {paginatedEnquiries.length === 0 ? (
        <div
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            backgroundColor: '#faf8f5',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <MessageSquare size={36} color="#cbd5e1" style={{ margin: '0 auto 0.6rem' }} />
          <div style={{ fontWeight: 800, color: '#334155', fontSize: '0.95rem' }}>
            No inquiries found
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            {searchQuery ? 'Try changing your search query or tab filter.' : 'Customer messages submitted via the Contact Us form will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 0.35rem',
              textAlign: 'left',
              fontSize: '0.82rem',
              whiteSpace: 'nowrap',
            }}
          >
            <thead>
              <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Inquiry ID</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Customer Name</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Contact Details</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Topic / Subject</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800, width: '25%' }}>Message Query</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Status</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEnquiries.map((enq) => {
                const badge = getStatusBadge(enq.status);
                const BadgeIcon = badge.icon;
                const initials = enq.name ? enq.name.substring(0, 2).toUpperCase() : 'EN';
                const waPhone = cleanPhoneForWa(enq.phone);

                return (
                  <tr
                    key={enq.id}
                    style={{
                      backgroundColor: '#faf8f5',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Inquiry ID */}
                    <td
                      style={{
                        padding: '0.65rem 0.75rem',
                        fontWeight: 900,
                        color: '#64748b',
                        borderTopLeftRadius: '8px',
                        borderBottomLeftRadius: '8px',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: '#f1f5f9',
                          padding: '0.2rem 0.45rem',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '0.75rem',
                        }}
                      >
                        #{enq.customId || `ENQ-${enq.id}`}
                      </span>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0f291e 0%, #1a4332 100%)',
                            color: '#f59e0b',
                            fontWeight: 900,
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f291e', fontSize: '0.86rem' }}>
                            {enq.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={11} /> {formatDate(enq.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact details with quick action links */}
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <a
                          href={`mailto:${enq.email}`}
                          style={{
                            color: '#0369a1',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                          title="Click to email customer"
                        >
                          <Mail size={12} color="#0369a1" />
                          {enq.email}
                        </a>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <a
                            href={`tel:${enq.phone}`}
                            style={{
                              color: '#334155',
                              textDecoration: 'none',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                            title="Click to call customer"
                          >
                            <Phone size={12} color="#64748b" />
                            {enq.phone}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Subject Topic */}
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <span
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#1e293b',
                          border: '1px solid #cbd5e1',
                          padding: '0.22rem 0.55rem',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          display: 'inline-block',
                          maxWidth: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {enq.subject || 'Product Enquiries'}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td style={{ padding: '0.65rem 0.75rem', maxWidth: '240px' }}>
                      <div
                        onClick={() => openDetailModal(enq)}
                        style={{
                          color: '#475569',
                          fontSize: '0.78rem',
                          lineHeight: '1.4',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                        title="Click to view full message"
                      >
                        <FileText size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{enq.message}</span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <select
                          value={enq.status || 'pending'}
                          disabled={updatingId === enq.id}
                          onChange={(e) => handleQuickStatusChange(enq.id, e.target.value as any)}
                          style={{
                            padding: '0.25rem 0.55rem',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="pending">🟡 Pending</option>
                          <option value="contacted">🔵 Contacted</option>
                          <option value="resolved">🟢 Resolved</option>
                          <option value="closed">⚪ Closed</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      style={{
                        padding: '0.65rem 0.75rem',
                        textAlign: 'right',
                        borderTopRightRadius: '8px',
                        borderBottomRightRadius: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => openDetailModal(enq)}
                          style={{
                            backgroundColor: '#0f291e',
                            color: '#fff',
                            border: 'none',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '7px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                          title="View complete inquiry & respond"
                        >
                          <Eye size={13} /> View
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteEnquiry(enq.id)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fca5a5',
                            padding: '0.35rem 0.55rem',
                            borderRadius: '7px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Delete inquiry record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: '1rem' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredEnquiries.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* DETAILED INQUIRY MODAL */}
      {selectedEnquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              width: '100%',
              maxWidth: '620px',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.2rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #0f291e 0%, #1a4332 100%)',
                color: '#fff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b',
                  }}
                >
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>
                    Inquiry Details #{selectedEnquiry.customId || `ENQ-${selectedEnquiry.id}`}
                  </h3>
                  <p style={{ margin: '0.1rem 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
                    Received on {formatDate(selectedEnquiry.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                style={{
                  border: 'none',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.4rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Customer Info Card */}
              <div
                style={{
                  backgroundColor: '#faf8f5',
                  padding: '1rem 1.2rem',
                  borderRadius: '12px',
                  border: '1px solid #e8dfd3',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Customer Information
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Full Name</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f291e' }}>{selectedEnquiry.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email Address</div>
                    <a href={`mailto:${selectedEnquiry.email}`} style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0369a1', textDecoration: 'none' }}>
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Phone Number</div>
                    <a href={`tel:${selectedEnquiry.phone}`} style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f291e', textDecoration: 'none' }}>
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                </div>

                {/* Quick Outreach Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed #cbd5e1' }}>
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    style={{
                      backgroundColor: '#0f291e',
                      color: '#fff',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Phone size={12} /> Call Customer
                  </a>
                  <a
                    href={`https://wa.me/${cleanPhoneForWa(selectedEnquiry.phone)}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name}, regards from Nutflix team! In reference to your inquiry on "${selectedEnquiry.subject}"...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#25D366',
                      color: '#fff',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <MessageCircle size={13} /> Chat on WhatsApp
                  </a>
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=${encodeURIComponent(`Nutflix Response: ${selectedEnquiry.subject}`)}`}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#fff',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Mail size={12} /> Send Email
                  </a>
                </div>
              </div>

              {/* Inquiry Topic & Message */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Topic / Subject
                </div>
                <div style={{ backgroundColor: '#f1f5f9', padding: '0.55rem 0.85rem', borderRadius: '8px', fontWeight: 800, color: '#0f291e', fontSize: '0.88rem' }}>
                  {selectedEnquiry.subject || 'Product Enquiries'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Customer Message
                </div>
                <div
                  style={{
                    backgroundColor: '#faf8f5',
                    padding: '0.9rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    color: '#1e293b',
                    fontSize: '0.88rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Update & Admin Notes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Inquiry Status
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      backgroundColor: '#f8fafc',
                      outline: 'none',
                    }}
                  >
                    <option value="pending">🟡 Pending / New</option>
                    <option value="contacted">🔵 Contacted Customer</option>
                    <option value="resolved">🟢 Resolved</option>
                    <option value="closed">⚪ Closed</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Internal Admin Follow-up Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add internal notes on follow-up (e.g., 'Called customer, quote sent on email')..."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                      backgroundColor: '#f8fafc',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#fff',
                  color: '#475569',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                disabled={savingModal}
                onClick={handleSaveModal}
                style={{
                  padding: '0.55rem 1.3rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0f291e 0%, #1a4332 100%)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  opacity: savingModal ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{savingModal ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
