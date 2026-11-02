'use client';
import Link from 'next/link';
import { Truck, ShieldCheck, Ruler, Headset, ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';
import { api, asList, normProduct } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';
import { Empty } from '@/components/ui';

const perks = [
  [Truck, 'Free delivery and installation', 'Door to door within Nairobi.'],
  [ShieldCheck, 'One-year warranty', 'Free on every BOLESI product.'],
  [Ruler, 'Free measuring visit', 'Our team checks your cutout first.'],
  [Headset, 'After-sales support', 'Help when you need it.'],
];

export default function Home() {
  const prods = useFetch(() => api('/products').then((d) => asList(d, 'products').map(normProduct).slice(0, 8)), []);
  const cats = useFetch(() => api('/categories').then((d) => asList(d, 'categories')), []);
  return (
    <>
      <section className="hero"><div className="promo-strip"><span>BOLESI HOME APPLIANCES</span><span>Designed for modern Kenyan homes</span></div>
        <div className="wrap">
          <div>
            <span className="eyebrow"><Sparkles size={15} /> SMART LIVING STARTS HERE</span><h1>Make home feel <em>exceptional.</em></h1>
            <p>Discover thoughtfully designed kitchen appliances, water heating solutions and smart home essentials that bring comfort, style and confidence to everyday living.</p>
            <div className="row wrapx">
              <Link href="/products" className="btn flame">Shop appliances <ArrowRight size={18} /></Link>
              <Link href="/products" className="btn ghost">Explore collection</Link>
            </div>
          </div>
          <div className="hero-art"><div className="hero-art-glow" /><img src="https://cdn.xuansiwei.com/liuji7923/1701137816768/tupian%203.png?x-oss-process=style%2Fpng_small" alt="Built-in gas hob" /><div className="hero-note"><BadgeCheck size={20} /><span><b>Made for modern living</b><small>Style meets everyday performance</small></span></div></div>
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
            <span className="eyebrow dark">FIND YOUR FIT</span><h2>Shop by category</h2>
            <div className="row wrapx" style={{ marginTop: 16 }}>
              {cats.data.map((c) => <Link key={c.id} className="chip" href={'/products?cat=' + (c.id)}>{c.name}</Link>)}
            </div>
          </section>
        )}
        <section className="sec">
          <div className="row between"><div><span className="eyebrow dark">THE BOLESI EDIT</span><h2>Featured appliances</h2></div><Link href="/products" className="btn sm ghost">Shop all products <ArrowRight size={16} /></Link></div>
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
