'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, ShoppingCart, User, LayoutDashboard, ChevronDown, Headphones } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';

const links = [['/', 'Home'], ['/products', 'Shop'], ['/products?cat=hobs', 'Hobs'], ['/cart', 'Cart']];

export default function Header() {
  const { count } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const [q, setQ] = useState('');
  return (
    <>
      <header className="hdr">
        <div className="wrap">
          <Link href="/" className="logo"><img src="/bolesi-logo.png" alt="BOLESI" className="brand-logo" width="220" height="100" fetchPriority="high" /></Link>
          <nav className="nav" aria-label="Main">
            <Link href="/" className={path === '/' ? 'on' : ''}>Home</Link>
            <Link href="/products" className={path.startsWith('/products') ? 'on' : ''}>Shop</Link>
          </nav>
          <span className="grow" />
          <form className="search" onSubmit={(e) => { e.preventDefault(); router.push('/products?q=' + encodeURIComponent(q)); }}>
            <Search size={17} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search appliances, brands and models" aria-label="Search products" />
          </form>
          {isAdmin && <Link href="/admin" className="icon-btn" aria-label="Admin dashboard"><LayoutDashboard size={18} /></Link>}
          {user ? (
            <button className="icon-btn" onClick={logout} aria-label="Sign out" title={'Sign out ' + (user.name || '')}><User size={18} /></button>
          ) : (
            <Link href="/login" className="icon-btn" aria-label="Sign in"><User size={18} /></Link>
          )}
          <Link href="/cart" className="icon-btn" aria-label={'Cart, ' + count + ' items'}>
            <ShoppingCart size={18} />{count > 0 && <span className="badge">{count}</span>}
          </Link>
        </div>
      </header>
      <nav className="mnav" aria-label="Quick links">
        {links.slice(0, 2).map(([h, l]) => <Link key={h} href={h} className="chip">{l}</Link>)}
        <Link href="/cart" className="chip">Cart</Link>
      </nav>
    </>
  );
}
