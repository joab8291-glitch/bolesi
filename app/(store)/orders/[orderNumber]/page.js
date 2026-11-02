'use client';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Check, Clock, PackageCheck, Truck, CreditCard } from 'lucide-react';
import { api, kes, normOrder } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { Empty } from '@/components/ui';

const flow = [['PENDING', 'Order placed', Clock], ['PAID', 'Paid', CreditCard], ['PROCESSING', 'Preparing', PackageCheck], ['SHIPPED', 'On the way / ready', Truck], ['COMPLETED', 'Completed', Check]];

export default function OrderPage() {
  const { orderNumber } = useParams();
  const paying = useSearchParams().get('paying');
  const { data, error, loading, reload } = useFetch(() => api('/orders/' + orderNumber).then((d) => normOrder(d.order || d)), [orderNumber]);
  const unpaid = data && !/paid|success|complete/i.test(data.payStatus + data.status);
  useEffect(() => { if (!unpaid) return; const t = setInterval(reload, 6000); return () => clearInterval(t); }, [unpaid, reload]);
  if (loading && !data) return <div className="wrap sec"><div className="skel" /></div>;
  if (error || !data) return <div className="wrap sec"><Empty>We could not find order {orderNumber}. {error}</Empty></div>;
  const idx = Math.max(0, flow.findIndex(([k]) => data.status.toUpperCase().includes(k.slice(0, 5))));
  return (
    <div className="wrap sec" style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: 34 }}>Order {data.number}</h1>
      {paying && unpaid && <div className="ok" style={{ margin: '14px 0' }}>Check your phone and enter your M-Pesa PIN to finish paying. This page updates by itself.</div>}
      {!paying && unpaid && /pay.?at.?shop/i.test(JSON.stringify(data)) && <div className="ok" style={{ margin: '14px 0' }}>Pay at the shop when you collect. We will confirm payment on pickup.</div>}
      <div className="steps" style={{ margin: '18px 0' }}>
        {flow.map(([k, l, I], i) => <div key={k} className={'step' + (i <= idx ? ' done' : '')}><I size={16} />{l}</div>)}
      </div>
      <div className="panel">
        <div className="row between"><b>Status</b><span className="tag info">{data.status}</span></div>
        {data.payStatus && <div className="row between" style={{ marginTop: 8 }}><b>Payment</b><span className={'tag ' + (/paid|success/i.test(data.payStatus) ? '' : 'warn')}>{data.payStatus}</span></div>}
        <div style={{ marginTop: 14 }}>
          {data.items.map((i, n) => <div className="sum" key={n}><span>{i.qty} × {i.name}</span><span>{i.price ? kes(i.qty * i.price) : ''}</span></div>)}
          <div className="sum t"><span>Total</span><span>{kes(data.total)}</span></div>
        </div>
      </div>
    </div>
  );
}
