'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { kes } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { Thumb } from './ui';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const out = p.stock === 0;
  return (
    <article className="pcard">
      <Link href={'/products/' + p.slug} className="pimg"><Thumb src={p.image} alt={p.name} /></Link>
      <div className="pbody">
        {p.categoryName && <span className="muted" style={{ fontSize: 13 }}>{p.categoryName}</span>}
        <h3><Link href={'/products/' + p.slug}>{p.name}</Link></h3>
        {p.sku && <span className="muted" style={{ fontSize: 13 }}>{p.sku}</span>}
        <div className="row between" style={{ marginTop: 'auto', paddingTop: 8 }}>
          <span className="price">{p.price ? kes(p.price) : 'Ask for price'}</span>
          <button className="btn sm flame" disabled={out || !p.price} onClick={() => add(p)} aria-label={'Add ' + p.name + ' to cart'}>
            <ShoppingCart size={15} />{out ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
