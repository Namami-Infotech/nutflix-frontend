import React from 'react';
import '@/styles/globals.css';
import { AuthProvider } from '@/modules/auth';
import { CartProvider, CartDrawer } from '@/modules/cart';
import { AnnouncementBar, Header, Footer } from '@/modules/layout';

export const metadata = {
  title: 'NUTFLIX | Premium Dry Fruits, Cashews & Nuts',
  description: 'NUTFLIX - Premium handcrafted dry fruits, almonds, giant roasted cashews, and organic walnuts.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <CartDrawer />
            <main style={{ minHeight: '80vh' }}>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

