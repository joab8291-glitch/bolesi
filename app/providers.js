'use client';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';

export default function Providers({ children }) {
  return <AuthProvider><CartProvider>{children}</CartProvider></AuthProvider>;
}
