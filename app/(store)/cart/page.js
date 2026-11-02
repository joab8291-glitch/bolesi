'use client';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { kes } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { Empty, Thumb } from '@/components/ui';

export default function Cart() {
  const { items, setQty, remove, subtotal } = useCart();
  if (!items.length) return <div className="wrap sec"><h1>Your cart</h1><div style={{ marginTop: 18 }}><Empty>Your cart is empty. <Link href="/products" style={{ textDecoration: 'underline' }}>Browse appliances</Link></Empty></div></div>;
  return (
    <div className="wrap sec cart-page">
      <div className="cart-heading"><div><span className="eyebrow dark">YOUR SELECTION</span><h1>Your cart</h1><p>Review your items before checkout.</p></div><Link href="/products" className="btn ghost cart-continue">Continue shopping</Link></div>
      <div className="two">
        <div className="panel">
          {items.map((i) => (
            <div className="line cart-line" key={i.id}>
              <div className="thumb"><Thumb src={i.image} alt={i.name} /></div>
              <div className="grow"><Link href={'/products/' + i.slug}><b>{i.name}</b></Link><div className="muted">{kes(i.price)}</div></div>
              <div className="qty">
                <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease"><Minus size={15} /></button>
                <span>{i.qty}</span>
                <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase"><Plus size={15} /></button>
              </div>
              <b className="cart-line-total">{kes(i.price * i.qty)}</b>
              <button className="icon-btn" onClick={() => remove(i.id)} aria-label={'Remove ' + i.name}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <div className="panel cart-summary">
          <h2>Order summary</h2><div className="sum"><span>Subtotal</span><span>{kes(subtotal)}</span></div>
          <div className="sum muted"><span>Delivery</span><span>Calculated at checkout</span></div>
          <div className="sum t"><span>Total</span><span>{kes(subtotal)}</span></div>
          <Link href="/checkout" className="btn flame" style={{ width: '100%', marginTop: 14 }}><ShoppingBag size={18} />Checkout</Link>
        </div>
      </div>
    </div>
  );
}
