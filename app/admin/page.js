'use client';
import Link from 'next/link';
import { ClipboardList, Banknote, Package, Clock } from 'lucide-react';
import { api, asList, kes, normOrder, normProduct } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { Err } from '@/components/ui';

export default function Overview() {
  const o = useFetch(() => api('/admin/orders', { auth: true }).then((d) => asList(d, 'orders').map(normOrder)), []);
  const p = useFetch(() => api('/products').then((d) => asList(d, 'products').map(normProduct)), []);
  const orders = o.data || [];
  const paid = orders.filter((x) => /paid|success/i.test(x.payStatus));
  const pending = orders.filter((x) => !/paid|success/i.test(x.payStatus) && !/cancel/i.test(x.status));
  const low = (p.data || []).filter((x) => x.stock !== null && x.stock < 5);
  const stats = [[ClipboardList, 'Orders', orders.length], [Banknote, 'Paid revenue', kes(paid.reduce((s, x) => s + x.total, 0))], [Clock, 'Awaiting payment', pending.length], [Package, 'Products', (p.data || []).length]];
  return (
    <>
      <h1>Overview</h1>
      <p className="muted">What needs your attention today.</p>
      <Err>{o.error || p.error}</Err>
      <div className="stats">
        {stats.map(([I, l, v]) => <div className="glass stat" key={l}><I size={20} className="muted" /><b>{v}</b><span className="muted">{l}</span></div>)}
      </div>
      <div className="glass">
        <div className="row between"><h3>Latest orders</h3><Link href="/admin/orders" className="muted">All orders</Link></div>
        <div className="tscroll"><table className="tbl"><tbody>
          {orders.slice(0, 6).map((x) => <tr key={x.id || x.number}><td>{x.number}</td><td>{kes(x.total)}</td><td><span className="tag info">{x.status}</span></td></tr>)}
          {!orders.length && <tr><td className="muted">No orders yet.</td></tr>}
        </tbody></table></div>
      </div>
      {low.length > 0 && <div className="glass" style={{ marginTop: 14 }}><h3>Low stock</h3>{low.map((x) => <div className="sum" key={x.id}><span>{x.name}</span><span className="tag warn">{x.stock} left</span></div>)}</div>}
    </>
  );
}
