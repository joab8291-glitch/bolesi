'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingCart, Truck, ShieldCheck, Minus, Plus, Check } from 'lucide-react';
import { api, kes, normProduct } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { useCart } from '@/lib/cart';
import { Empty, Thumb } from '@/components/ui';

export default function ProductPage() {
  const { slug } = useParams();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { data, error, loading } = useFetch(() => api('/products/' + slug).then((d) => normProduct(d.product || d)), [slug]);
  if (loading) return <div className="wrap sec"><div className="skel" style={{ height: 420 }} /></div>;
  if (error || !data) return <div className="wrap sec"><Empty>Product not found. <Link href="/products" style={{ textDecoration: 'underline' }}>Back to the shop</Link></Empty></div>;
  const p = data;
  const out = p.stock === 0;
  return (
    <div className="wrap sec">
      <div className="two" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <div className="pimg panel" style={{ aspectRatio: '1', padding: 0, overflow: 'hidden' }}><Thumb src={p.images[img] || p.image} alt={p.name} /></div>
          {p.images.length > 1 && (
            <div className="row wrapx" style={{ marginTop: 10 }}>
              {p.images.map((s, i) => <button key={s} onClick={() => setImg(i)} className="thumb" style={{ width: 64, height: 64, border: i === img ? '2px solid var(--flame-d)' : '1px solid var(--line)', borderRadius: 10, padding: 0, overflow: 'hidden' }} aria-label={'Image ' + (i + 1)}><Thumb src={s} /></button>)}
            </div>
          )}
        </div>
        <div className="stack">
          {p.categoryName && <span className="muted">{p.categoryName}</span>}
          <h1 style={{ fontSize: 'clamp(28px,4vw,42px)' }}>{p.name}</h1>
          {p.sku && <span className="muted">Model {p.sku}</span>}
          <div className="price" style={{ fontSize: 30 }}>{p.price ? kes(p.price) : 'Ask for price'}</div>
          {p.stock !== null && <span className={'tag ' + (out ? 'bad' : p.stock < 5 ? 'warn' : '')} style={{ width: 'fit-content' }}>{out ? 'Out of stock' : p.stock < 5 ? 'Only ' + p.stock + ' left' : 'In stock'}</span>}
          {p.description && <p style={{ whiteSpace: 'pre-line' }}>{p.description}</p>}
          <div className="row wrapx">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus size={16} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="Increase"><Plus size={16} /></button>
            </div>
            <button className="btn flame" disabled={out || !p.price} onClick={() => { add(p, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); }}>
              {added ? <Check size={18} /> : <ShoppingCart size={18} />}{added ? 'Added to cart' : 'Add to cart'}
            </button>
          </div>
          <div className="panel stack" style={{ padding: 16 }}>
            <div className="row"><Truck size={20} />Free delivery and installation within Nairobi</div>
            <div className="row"><ShieldCheck size={20} />Free one-year warranty</div>
          </div>
        </div>
      </div>
    </div>
  );
}
