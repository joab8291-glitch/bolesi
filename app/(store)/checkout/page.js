'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Phone, Mail, MapPin, Truck, Store, Smartphone, Banknote } from 'lucide-react';
import { api, asList, kes } from '@/lib/api';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { Field, Spin, Err, Empty } from '@/components/ui';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ name: '', phone: '', email: '', address: '', notes: '', branchId: '' });
  const [fulfil, setFulfil] = useState('DELIVERY');
  const [pay, setPay] = useState('MPESA');
  const [branches, setBranches] = useState([]);
  const [cfg, setCfg] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    api('/branches').then((d) => setBranches(asList(d, 'branches'))).catch(() => {});
    api('/config/public').then(setCfg).catch(() => {});
  }, []);
  useEffect(() => { if (user) setF((s) => ({ ...s, name: s.name || user.name || '', email: s.email || user.email || '', phone: s.phone || user.phone || '' })); }, [user]);
  useEffect(() => { if (fulfil === 'DELIVERY' && pay === 'PAY_AT_SHOP') setPay('MPESA'); }, [fulfil, pay]);

  const fee = Number(cfg.deliveryFeeKes ?? cfg.deliveryFee ?? cfg.delivery?.fee ?? 0) || 0;
  const total = subtotal + (fulfil === 'DELIVERY' ? fee : 0);

  if (!items.length) return <div className="wrap sec"><Empty>Your cart is empty. <Link href="/products" style={{ textDecoration: 'underline' }}>Browse appliances</Link></Empty></div>;

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (fulfil === 'DELIVERY' && !f.address.trim()) return setError('Enter your delivery address.');
    if (fulfil === 'PICKUP' && !f.branchId) return setError('Choose the branch where you will collect.');
    setBusy(true);
    try {
      const body = {
        customerName: f.name, name: f.name, phone: f.phone, customerPhone: f.phone, email: f.email || undefined,
        fulfilment: fulfil, fulfillmentType: fulfil, deliveryAddress: fulfil === 'DELIVERY' ? f.address : undefined,
        notes: f.notes || undefined, branchId: fulfil === 'PICKUP' ? f.branchId : undefined,
        paymentMethod: pay,
        items: items.map((i) => ({ productId: i.id, quantity: i.qty })),
      };
      const d = await api('/orders', { method: 'POST', body, auth: true });
      const o = d.order || d;
      const number = o.orderNumber || o.number || o.id;
      if (pay === 'MPESA') {
        await api('/payments/mpesa/stk', { method: 'POST', body: { orderNumber: number, orderId: o.id, phone: f.phone } });
      }
      clear();
      router.push('/orders/' + number + (pay === 'MPESA' ? '?paying=1' : ''));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="wrap sec">
      <h1 style={{ fontSize: 36, marginBottom: 20 }}>Checkout</h1>
      <form className="two" onSubmit={submit}>
        <div className="stack">
          <div className="panel stack">
            <h3>Your details</h3>
            <Field icon={User} label="Full name" value={f.name} onChange={set('name')} required autoComplete="name" />
            <div className="cols2">
              <Field icon={Phone} label="M-Pesa phone number" value={f.phone} onChange={set('phone')} required placeholder="07XX XXX XXX" inputMode="tel" autoComplete="tel" />
              <Field icon={Mail} label="Email (optional)" type="email" value={f.email} onChange={set('email')} autoComplete="email" />
            </div>
          </div>
          <div className="panel stack">
            <h3>How would you like to receive it?</h3>
            <div className="seg">
              <button type="button" className={'opt' + (fulfil === 'DELIVERY' ? ' on' : '')} onClick={() => setFulfil('DELIVERY')}><Truck size={22} /><span><b>Delivery</b><br /><span className="muted">To your address, with installation</span></span></button>
              <button type="button" className={'opt' + (fulfil === 'PICKUP' ? ' on' : '')} onClick={() => setFulfil('PICKUP')}><Store size={22} /><span><b>Collect at a branch</b><br /><span className="muted">Pick up from the shop</span></span></button>
            </div>
            {fulfil === 'DELIVERY' ? (
              <>
                <Field icon={MapPin} label="Delivery address" textarea value={f.address} onChange={set('address')} placeholder="Estate, street, building, house number" />
                <Field label="Notes for the driver (optional)" value={f.notes} onChange={set('notes')} />
              </>
            ) : branches.length ? (
              <Field icon={Store} label="Collection branch" value={f.branchId} onChange={set('branchId')}>
                <option value="">Choose a branch</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}{b.city ? ', ' + b.city : ''}</option>)}
              </Field>
            ) : <Empty>No branches are set up for collection yet.</Empty>}
          </div>
          <div className="panel stack">
            <h3>Payment</h3>
            <div className="seg">
              <button type="button" className={'opt' + (pay === 'MPESA' ? ' on' : '')} onClick={() => setPay('MPESA')}><Smartphone size={22} /><span><b>M-Pesa</b><br /><span className="muted">Approve the prompt on your phone</span></span></button>
              <button type="button" disabled={fulfil === 'DELIVERY'} className={'opt' + (pay === 'PAY_AT_SHOP' ? ' on' : '')} onClick={() => setPay('PAY_AT_SHOP')}><Banknote size={22} /><span><b>Pay at the shop</b><br /><span className="muted">{fulfil === 'DELIVERY' ? 'Available for collection orders' : 'Pay when you collect'}</span></span></button>
            </div>
          </div>
        </div>
        <div className="panel stack" style={{ position: 'sticky', top: 90 }}>
          <h3>Order summary</h3>
          {items.map((i) => <div className="sum" key={i.id}><span>{i.qty} × {i.name}</span><span>{kes(i.qty * i.price)}</span></div>)}
          <div className="sum"><span>Subtotal</span><span>{kes(subtotal)}</span></div>
          <div className="sum"><span>Delivery</span><span>{fulfil === 'DELIVERY' ? (fee ? kes(fee) : 'Confirmed on order') : 'None'}</span></div>
          <div className="sum t"><span>Total</span><span>{kes(total)}</span></div>
          <Err>{error}</Err>
          <button className="btn flame" disabled={busy} style={{ width: '100%' }}>{busy ? <Spin /> : null}{pay === 'MPESA' ? 'Place order and pay with M-Pesa' : 'Place order'}</button>
        </div>
      </form>
    </div>
  );
}
