import React from 'react';
import '@/styles/globals.css';
import { AuthProvider } from '@/modules/auth';
import { CartProvider, CartDrawer } from '@/modules/cart';
import { AnnouncementBar, Header, Footer } from '@/modules/layout';

export const metadata = {
  title: 'Nutclick | Premium Dry Fruits, Categories',
  description: 'NUTCLICK - Premium handcrafted dry fruits, almonds, giant roasted cashews, and organic walnuts.',
  icons: {
    icon: '/favicon.ico?v=3',
    shortcut: '/favicon.ico?v=3',
    apple: '/favicon.ico?v=3',
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

