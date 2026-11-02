'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { api, asList, normProduct } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';
import { Empty } from '@/components/ui';

function Shop() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = (sp.get('q') || '').toLowerCase();
  const cat = sp.get('cat') || '';
  const [text, setText] = useState(sp.get('q') || '');
  const prods = useFetch(() => api('/products').then((d) => asList(d, 'products').map(normProduct)), []);
  const cats = useFetch(() => api('/categories').then((d) => asList(d, 'categories')), []);
  const set = (k, v) => {
    const n = new URLSearchParams(sp.toString());
    v ? n.set(k, v) : n.delete(k);
    router.push('/products?' + n.toString());
  };
  const list = (prods.data || []).filter((p) =>
    (!cat || String(p.categoryId) === cat) &&
    (!q || (p.name + ' ' + p.sku + ' ' + p.categoryName).toLowerCase().includes(q)));
  return (
    <div className="wrap sec">
      <h1 style={{ fontSize: 'clamp(30px,4vw,44px)' }}>Shop appliances</h1>
      <form className="search shop-search" style={{ margin: '18px 0', maxWidth: 420 }} onSubmit={(e) => { e.preventDefault(); set('q', text); }}>
        <Search size={17} /><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search by name or model" aria-label="Search" />
      </form>
      <div className="row wrapx" style={{ marginBottom: 20 }}>
        <button className={'chip' + (!cat ? ' on' : '')} onClick={() => set('cat', '')}>All</button>
        {(cats.data ? asList(cats.data, 'categories') : []).map((c) => (
          <button key={c.id} className={'chip' + (cat === String(c.id) ? ' on' : '')} onClick={() => set('cat', String(c.id))}>{c.name}</button>
        ))}
      </div>
      <div className="grid">
        {prods.loading && [0, 1, 2, 3, 4, 5].map((i) => <div className="skel" key={i} />)}
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {prods.error && <Empty>We could not load products. {prods.error}</Empty>}
      {prods.data && list.length === 0 && <Empty>No products match. Clear the search or pick another category.</Empty>}
    </div>
  );
}

export default function Page() { return <Suspense fallback={<div className="wrap sec"><div className="skel" /></div>}><Shop /></Suspense>; }
