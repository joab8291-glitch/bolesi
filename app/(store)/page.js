'use client';
import Link from 'next/link';
import { Truck, ShieldCheck, Ruler, Headset, ArrowRight } from 'lucide-react';
import { api, asList, normProduct } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';
import { Empty } from '@/components/ui';

const perks = [
  [Truck, 'Free delivery and installation', 'Door to door within Nairobi.'],
  [ShieldCheck, 'One-year warranty', 'Free on every BOLESI product.'],
  [Ruler, 'Free measuring visit', 'Our team checks your cutout first.'],
  [Headset, '24/7 after-sales', 'Service that comes to your door.'],
];

export default function Home() {
  const prods = useFetch(() => api('/products').then((d) => asList(d, 'products').map(normProduct).slice(0, 8)), []);
  const cats = useFetch(() => api('/categories').then((d) => asList(d, 'categories')), []);
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>Cook, heat and lock up your home with BOLESI.</h1>
            <p>Built-in gas hobs, ovens, water heaters and smart locks, delivered and installed free across Nairobi. Order online, pay with M-Pesa or at the shop.</p>
            <div className="row wrapx">
              <Link href="/products" className="btn flame">Shop appliances <ArrowRight size={18} /></Link>
              <Link href="/login" className="btn ghost">Sign in</Link>
            </div>
          </div>
          <div className="burner" role="img" aria-label="Gas burner with blue flame ring" />
        </div>
      </section>
      <div className="wrap">
        <div className="perks">
          {perks.map(([I, t, d]) => (
            <div className="perk" key={t}><I size={22} /><div><b>{t}</b><span>{d}</span></div></div>
          ))}
        </div>
        {cats.data && cats.data.length > 0 && (
          <section className="sec" style={{ paddingBottom: 0 }}>
            <h2>Shop by category</h2>
            <div className="row wrapx" style={{ marginTop: 16 }}>
              {cats.data.map((c) => <Link key={c.id} className="chip" href={'/products?cat=' + (c.id)}>{c.name}</Link>)}
            </div>
          </section>
        )}
        <section className="sec">
          <div className="row between"><h2>New arrivals</h2><Link href="/products" className="muted">View all</Link></div>
          <div className="grid" style={{ marginTop: 20 }}>
            {prods.loading && [0, 1, 2, 3].map((i) => <div className="skel" key={i} />)}
            {prods.data && prods.data.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
          {prods.error && <Empty>We could not load products. {prods.error}</Empty>}
          {prods.data && prods.data.length === 0 && <Empty>No products yet. Add the first one from the admin dashboard.</Empty>}
        </section>
      </div>
    </>
  );
}
