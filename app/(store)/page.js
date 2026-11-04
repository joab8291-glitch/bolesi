'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, ShieldCheck, Ruler, Headset, ArrowRight, BadgeCheck, Sparkles, Bath, CookingPot, SprayCan, Layers, WashingMachine, Flame, Heater, Droplets, Gem, Zap, ChefHat, Microwave, Percent, Wind, Wifi, Package } from 'lucide-react';
import { api, asList, normProduct } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';
import { Empty } from '@/components/ui';

const categoryIcons = [
  [/bathroom|bath/i, Bath],
  [/built.?in oven|oven/i, CookingPot],
  [/cleaning/i, SprayCan],
  [/collection/i, Layers],
  [/dishwasher/i, WashingMachine],
  [/electric cooker/i, Zap],
  [/gas hob|gas cooker/i, Flame],
  [/gas water heater|water heater/i, Heater],
  [/golden diamond/i, Gem],
  [/instant water heater/i, Droplets],
  [/kitchen appliance/i, ChefHat],
  [/microwave/i, Microwave],
  [/promotion/i, Percent],
  [/range hood/i, Wind],
  [/smart home/i, Wifi],
];

const categoryOrder = ['Bathroom', 'Built-in Ovens', 'Cleaning', 'Collections', 'Dishwashers', 'Electric Cookers', 'Gas Hobs & Cookers', 'Gas Water Heaters', 'Golden Diamond Series', 'Instant Water Heaters', 'Kitchen Appliances', 'Microwaves', 'Promotions', 'Range Hoods', 'Smart Home Devices'];

function CategoryIcon({ name }) {
  const Icon = categoryIcons.find(([pattern]) => pattern.test(name))?.[1] || Package;
  return <Icon size={21} strokeWidth={1.8} aria-hidden="true" />;
}

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
      <section className="hero hero-image"><div className="hero-image-bg"><Image src="/shopping.jpeg" alt="" fill priority fetchPriority="high" sizes="100vw" quality={75} style={{ objectFit: "cover", objectPosition: "center" }} /></div><div className="hero-video-shade" />
        <div className="wrap">
          <div>
            <span className="eyebrow"><Sparkles size={15} /> SMART LIVING STARTS HERE</span><h1>Make home feel <em>exceptional.</em></h1>
            <p>Discover thoughtfully designed kitchen appliances, water heating solutions and smart home essentials that bring comfort, style and confidence to everyday living.</p>
            <div className="row wrapx">
              <Link href="/products" className="btn flame">Shop appliances <ArrowRight size={18} /></Link>
              <Link href="/products" className="btn ghost">Explore collection</Link>
            </div>
          </div>
          <div className="hero-art"><div className="hero-art-glow" /><Image src="/homeappliances.jpeg" alt="BOLESI home appliances collection" width={740} height={520} loading="lazy" sizes="(max-width: 700px) 94vw, 48vw" quality={65} style={{ width: "100%", height: "auto", maxHeight: 520, objectFit: "contain" }} /><div className="hero-note"><BadgeCheck size={20} /><span><b>Made for modern living</b><small>Style meets everyday performance</small></span></div></div>
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
            <div className="category-chip-grid">
              {[...cats.data].sort((a, b) => { const ai = categoryOrder.findIndex((name) => name.toLowerCase() === a.name?.toLowerCase()); const bi = categoryOrder.findIndex((name) => name.toLowerCase() === b.name?.toLowerCase()); return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi); }).map((c) => <Link key={c.id} className="category-chip" href={'/products?cat=' + c.id}><span className="category-chip-icon"><CategoryIcon name={c.name} /></span><span className="category-chip-name">{c.name}</span><ArrowRight className="category-chip-arrow" size={16} aria-hidden="true" /></Link>)}
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
