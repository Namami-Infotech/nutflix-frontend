'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromCookie } from '@/lib/api';

export default function OrdersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromCookie();
    if (user && user.role?.toLowerCase() === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/profile?tab=orders');
    }
  }, [router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF7F2' }}>
      <div style={{ color: '#64748b', fontWeight: 700, fontSize: '0.95rem' }}>Loading Orders...</div>
    </div>
  );
}
