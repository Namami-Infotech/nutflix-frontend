'use client';

import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Mail, Phone, MapPin, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import Pagination from '@/components/Pagination';

interface UsersViewProps {
  usersList: any[];
  searchQuery: string;
  onDeleteUser?: (id: number) => void;
}

export default function UsersView({ usersList, searchQuery, onDeleteUser }: UsersViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredUsers = usersList.filter(
    u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <UserCheck size={18} color="#059669" /> Registered Users Directory
          </h3>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
            Showing {paginatedUsers.length} of {filteredUsers.length} filtered profiles.
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>User ID</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Customer Name</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Email Address</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>System Role</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Status</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Phone</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Primary Address</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>GST Number</th>
              {onDeleteUser && <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((usr) => {
              const initials = usr.name ? usr.name.substring(0, 2).toUpperCase() : 'US';
              const isAdmin = usr.role === 'admin';
              const isInactive = usr.status === 'inactive';

              return (
                <tr key={usr.id} style={{ backgroundColor: '#faf8f5', borderRadius: '8px', border: '1px solid #e2e8f0', opacity: isInactive ? 0.7 : 1 }}>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#64748b', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                    #{usr.id}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: isAdmin ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f291e' }}>{usr.name}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Joined Account</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', color: '#334155', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Mail size={13} color="#64748b" />
                      {usr.email}
                    </div>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <span style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px',
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      backgroundColor: isAdmin ? '#fef3c7' : '#e0f2fe',
                      color: isAdmin ? '#b45309' : '#0369a1',
                      border: `1px solid ${isAdmin ? '#fde68a' : '#bae6fd'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {isAdmin && <ShieldCheck size={11} />}
                      {usr.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <span style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px',
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      backgroundColor: isInactive ? '#fee2e2' : '#dcfce7',
                      color: isInactive ? '#b91c1c' : '#166534',
                      border: `1px solid ${isInactive ? '#fca5a5' : '#86efac'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {isInactive ? <AlertCircle size={11} /> : <CheckCircle size={11} />}
                      {isInactive ? 'inactive' : 'active'}
                    </span>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 700, color: '#1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Phone size={13} color="#64748b" />
                      {usr.phone || 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', color: '#64748b', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} color="#64748b" />
                      {usr.address || 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#475569', borderTopRightRadius: onDeleteUser ? '0' : '8px', borderBottomRightRadius: onDeleteUser ? '0' : '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FileText size={13} color="#64748b" />
                      {usr.gstNumber || 'N/A'}
                    </div>
                  </td>
                  {onDeleteUser && (
                    <td style={{ padding: '0.55rem 0.75rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                      {!isInactive && (
                        <button
                          onClick={() => onDeleteUser(usr.id)}
                          style={{
                            padding: '0.3rem 0.6rem',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fca5a5',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Trash2 size={13} /> Deactivate
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
