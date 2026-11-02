'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Save } from 'lucide-react';
import { api, asList, normProduct } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { Field, Spin, Err } from '@/components/ui';
import Modal from '@/components/Modal';

export default function Branches() {
  const br = useFetch(() => api('/branches').then((d) => asList(d, 'branches')), []);
  const prods = useFetch(() => api('/products').then((d) => asList(d, 'products').map(normProduct)), []);
  const [sel, setSel] = useState('');
  const [qty, setQty] = useState({});
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => { if (!sel && br.data && br.data[0]) setSel(String(br.data[0].id)); }, [br.data, sel]);

  const branchStock = (p) => {
    const inv = p.inventory || p.inventories || p.branchStock || p.stocks || [];
    const row = Array.isArray(inv) ? inv.find((i) => String(i.branchId ?? i.branch?.id) === sel) : null;
    return row ? row.quantity ?? row.available ?? 0 : 0;
  };
  async function saveBranch(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const body = { name: form.name.trim(), code: (form.code || '').trim().toUpperCase(), address: form.address.trim(), phone: form.phone.trim() || undefined };
      form.id ? await api('/admin/branches/' + form.id, { method: 'PATCH', body, auth: true }) : await api('/admin/branches', { method: 'POST', body, auth: true });
      setForm(null); br.reload();
    } catch (err) { setError(err.message); }
    setBusy(false);
  }
  async function saveStock(p) {
    setMsg('');
    const val = qty[p.id] ?? branchStock(p);
    try {
      await api('/admin/inventory', { method: 'PUT', auth: true, body: { branchId: sel, productId: p.id, quantity: Number(val) } });
      setMsg('Stock updated for ' + p.name + '.');
      prods.reload();
    } catch (err) { setMsg(err.message); }
  }
  return (
    <>
      <div className="row between wrapx"><div><h1>Branches and stock</h1><p className="muted">Each branch keeps its own stock count.</p></div>
        <button className="btn flame" onClick={() => { setError(''); setForm({ name: '', code: '', address: '', phone: '' }); }}><Plus size={18} />Add branch</button></div>
      <Err>{br.error}</Err>
      <div className="row wrapx" style={{ margin: '14px 0' }}>
        {(br.data || []).map((b) => (
          <span key={b.id} className="row">
            <button className={'chip' + (sel === String(b.id) ? ' on' : '')} onClick={() => setSel(String(b.id))}>{b.name}</button>
            <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => { setError(''); setForm({ id: b.id, name: b.name, code: b.code || '', address: b.address || '', phone: b.phone || '' }); }} aria-label={'Edit ' + b.name}><Pencil size={14} /></button>
          </span>
        ))}
        {br.data && !br.data.length && <span className="muted">Add your first branch, then set its stock.</span>}
      </div>
      {msg && <div className="ok" style={{ marginBottom: 12 }}>{msg}</div>}
      {sel && (
        <div className="glass tscroll">
          <table className="tbl"><thead><tr><th>Product</th><th>Quantity in this branch</th><th></th></tr></thead><tbody>
            {(prods.data || []).map((p) => (
              <tr key={p.id}><td><b>{p.name}</b><div className="muted">{p.sku}</div></td>
                <td><div className="amini"><input type="number" min="0" aria-label={'Quantity for ' + p.name} value={qty[p.id] ?? branchStock(p)} onChange={(e) => setQty({ ...qty, [p.id]: e.target.value })} /></div></td>
                <td><button className="btn sm ghost" onClick={() => saveStock(p)}><Save size={14} />Save</button></td></tr>
            ))}
          </tbody></table>
        </div>
      )}
      {form && (
        <Modal title={form.id ? 'Edit branch' : 'Add branch'} onClose={() => setForm(null)}>
          <form className="stack" onSubmit={saveBranch}>
            <Field label="Branch name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Branch code (e.g. NAIROBI-01)" value={form.code} onChange={(v) => setForm({ ...form, code: v.toUpperCase() })} required />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Address" textarea value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <Err>{error}</Err>
            <button className="btn flame" disabled={busy}>{busy && <Spin />}Save branch</button>
          </form>
        </Modal>
      )}
    </>
  );
}
