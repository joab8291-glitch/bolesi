'use client';
import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { api, asList, kes, normOrder } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { Err } from '@/components/ui';

const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'READY_FOR_COLLECTION', 'COMPLETED', 'CANCELLED'];

export default function Orders() {
  const { data, error, reload } = useFetch(() => api('/admin/orders', { auth: true }).then((d) => asList(d, 'orders').map(normOrder)), []);
  const [msg, setMsg] = useState('');
  async function setStatus(o, status) {
    setMsg('');
    try { await api('/admin/orders/' + o.id + '/status', { method: 'PATCH', body: { status }, auth: true }); reload(); } catch (e) { setMsg(e.message); }
  }
  async function confirmPay(o) {
    if (!confirm('Confirm payment received for order ' + o.number + '?')) return;
    setMsg('');
    try { await api('/admin/orders/' + o.id + '/confirm-payment', { method: 'POST', auth: true }); reload(); } catch (e) { setMsg(e.message); }
  }
  return (
    <>
      <h1>Orders</h1>
      <p className="muted">Update progress and confirm cash payments made at the shop.</p>
      <Err>{error || msg}</Err>
      <div className="glass tscroll" style={{ marginTop: 14 }}>
        <table className="tbl">
          <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {(data || []).map((o) => {
              const paid = /paid|success/i.test(o.payStatus);
              return (
                <tr key={o.id || o.number}>
                  <td><b>{o.number}</b><div className="muted">{o.fulfilment || o.fulfillmentType || ''}</div></td>
                  <td>{o.customerName || o.name || o.user?.name || '-'}<div className="muted">{o.phone || o.customerPhone || ''}</div></td>
                  <td>{kes(o.total)}</td>
                  <td><span className={'tag ' + (paid ? '' : 'warn')}>{o.payStatus || 'Unpaid'}</span></td>
                  <td><select aria-label={'Status for ' + o.number} value={o.status} onChange={(e) => setStatus(o, e.target.value)} style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.25)', borderRadius: 10, padding: '8px' }}>
                    {[...new Set([o.status, ...statuses])].map((s) => <option key={s} value={s} style={{ color: '#000' }}>{s}</option>)}</select></td>
                  <td>{!paid && <button className="btn sm ghost" onClick={() => confirmPay(o)}><BadgeCheck size={14} />Confirm payment</button>}</td>
                </tr>
              );
            })}
            {data && !data.length && <tr><td colSpan={6} className="muted">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
