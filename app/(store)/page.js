'use client';
import Link from 'next/link';
import Image from 'next/image';
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
  const prods = useFetch(() => api('/products').then((d) => asList(d, 'products').map(normProduct).slice(0, 18)), []);
  const cats = useFetch(() => api('/categories').then((d) => asList(d, 'categories')), []);
  return (
    <>
      <section className="hero hero-image"><div className="hero-image-bg" role="img" aria-label="Digital shopping and online commerce background" /><div className="hero-video-shade" /><div className="promo-strip"><span>BOLESI HOME APPLIANCES</span><span>Designed for modern Kenyan homes</span></div>
        <div className="wrap">
          <div>
            <span className="eyebrow"><Sparkles size={15} /> SMART LIVING STARTS HERE</span><h1>Make home feel <em>exceptional.</em></h1>
            <p>Discover thoughtfully designed kitchen appliances, water heating solutions and smart home essentials that bring comfort, style and confidence to everyday living.</p>
            <div className="row wrapx">
              <Link href="/products" className="btn flame">Shop appliances <ArrowRight size={18} /></Link>
              <Link href="/products" className="btn ghost">Explore collection</Link>
            </div>
          </div>
          <div className="hero-art"><div className="hero-art-glow" /><Image src="https://cdn.xuansiwei.com/liuji7923/1701137816768/tupian%203.png?x-oss-process=style%2Fpng_small" alt="Built-in gas hob" width={520} height={360} priority sizes="(max-width: 700px) 90vw, 42vw" /><div className="hero-note"><BadgeCheck size={20} /><span><b>Made for modern living</b><small>Style meets everyday performance</small></span></div></div>
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

        {prods.data && prods.data.length > 0 && (
          <>
            <section className="deal-shelf flash-shelf">
              <div className="deal-heading">
                <div><span className="deal-kicker">BOLESI SPECIAL SELECTION</span><h2>Featured deals <span className="live-pill"><span className="live-dot" /> Shop now</span></h2></div>
                <Link href="/products" className="deal-see">See all <ArrowRight size={16} /></Link>
              </div>
              <div className="deal-track">
                {prods.data.slice(0, 8).map((p) => <div className="deal-item" key={'featured-' + p.id}><ProductCard p={p} /></div>)}
              </div>
            </section>
            <section className="deal-shelf top-deals-shelf">
              <div className="deal-heading">
                <div><span className="deal-kicker">THE BOLESI COLLECTION</span><h2>Home essentials & top picks</h2></div>
                <Link href="/products" className="deal-see">Explore all <ArrowRight size={16} /></Link>
              </div>
              <div className="deal-track">
                {prods.data.slice(8, 16).length ? prods.data.slice(8, 16).map((p) => <div className="deal-item" key={'top-' + p.id}><ProductCard p={p} /></div>) : prods.data.slice(0, 8).map((p) => <div className="deal-item" key={'top-repeat-' + p.id}><ProductCard p={p} /></div>)}
              </div>
            </section>
          </>
        )}
      </div>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand"><img src="/bolesi-logo.png" alt="BOLESI" /><p>Thoughtfully designed home appliances for modern Kenyan homes.</p></div>
          <div><h3>Contact BOLESI Kenya</h3><p><a href="https://www.bolesi-kenya.com/" target="_blank" rel="noreferrer">Official website: bolesi-kenya.com</a></p><p>China Square, Karen — Waterfront Mall: <a href="tel:0785778215">0785 778 215</a></p><p>China Square, Ruaka: <a href="tel:0756663880">0756 663 880</a></p><p>China Square, Two Rivers: <a href="tel:0799373265">0799 373 265</a></p><p>Email: <a href="mailto:331688723@qq.com">331688723@qq.com</a></p></div>
          <div><h3>Customer care</h3><p>Free delivery and installation within Nairobi.</p><p>One-year product warranty.</p><p><Link href="/products">Shop all appliances</Link></p></div>
        </div>
        <div className="footer-bottom">© 2026 BOLESI Kenya. All rights reserved.</div>
      </footer>
    </>
  );
}
