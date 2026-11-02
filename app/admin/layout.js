'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, LayoutDashboard, Package, Tags, Store, ClipboardList, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Spin } from '@/components/ui';

const nav = [['/admin', 'Overview', LayoutDashboard], ['/admin/orders', 'Orders', ClipboardList], ['/admin/products', 'Products', Package], ['/admin/categories', 'Categories', Tags], ['/admin/branches', 'Branches and stock', Store]];

export default function AdminLayout({ children }) {
  const { ready, isAdmin, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => { if (ready && !isAdmin) router.replace('/login?next=/admin'); }, [ready, isAdmin, router]);
  if (!ready || !isAdmin) return <div className="adm" style={{ display: 'grid', placeItems: 'center' }}><Spin size={28} /></div>;
  return (
    <div className="adm">
      <aside className="side">
        <Link href="/admin" className="logo" style={{ color: '#fff' }}><Flame size={24} />BOLESI</Link>
        {nav.map(([h, l, I]) => <Link key={h} href={h} className={path === h ? 'on' : ''}><I size={18} />{l}</Link>)}
        <span className="grow" />
        <Link href="/"><ExternalLink size={18} />View store</Link>
        <a href="#" onClick={(e) => { e.preventDefault(); logout(); router.push('/login'); }}><LogOut size={18} />Sign out</a>
      </aside>
      <main className="amain">{children}</main>
    </div>
  );
}
