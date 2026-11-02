'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, ImagePlus } from 'lucide-react';
import { api, asList, kes, normProduct } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { Field, Spin, Err, Thumb } from '@/components/ui';
import Modal from '@/components/Modal';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const blank = { name: '', slug: '', price: '', sku: '', categoryId: '', description: '', imageUrl: '', originalImageUrl: '', status: 'ACTIVE' };

export default function Products() {
  const prods = useFetch(() => api('/admin/products', { auth: true }).then((d) => asList(d, 'products').map(normProduct)), []);
  const cats = useFetch(() => api('/categories').then((d) => asList(d, 'categories')), []);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setForm((s) => ({ ...s, [k]: v, ...(k === 'name' && !s.id ? { slug: slugify(v) } : {}) }));

  async function save(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const body = { name: form.name.trim(), price: Number(form.price), sku: form.sku.trim(), model: form.sku.trim(), brand: 'BOLESI', categoryId: form.categoryId || undefined, description: form.description.trim() || undefined, status: form.status || 'ACTIVE' };
      const d = form.id
        ? await api('/admin/products/' + form.id, { method: 'PATCH', body, auth: true })
        : await api('/admin/products', { method: 'POST', body, auth: true });
      const id = form.id || (d.product || d).id;
      if (id && form.imageUrl.trim() !== (form.originalImageUrl || '')) await api('/admin/products/' + id + '/images', { method: 'PUT', body: { images: form.imageUrl.trim() ? [{ url: form.imageUrl.trim(), alt: form.name }] : [] }, auth: true });
      setForm(null);
      prods.reload();
    } catch (err) { setError(err.message); }
    setBusy(false);
  }
  async function del(p) {
    if (!confirm('Delete ' + p.name + '? This cannot be undone.')) return;
    try { await api('/admin/products/' + p.id, { method: 'DELETE', auth: true }); prods.reload(); } catch (err) { alert(err.message); }
  }
  return (
    <>
      <div className="row between wrapx"><div><h1>Products</h1><p className="muted">Add, edit and remove what customers see in the shop.</p></div>
        <button className="btn flame" onClick={() => { setError(''); setForm(blank); }}><Plus size={18} />Add product</button></div>
      <Err>{prods.error}</Err>
      <div className="glass tscroll" style={{ marginTop: 14 }}>
        <table className="tbl">
          <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {(prods.data || []).map((p) => (
              <tr key={p.id}>
                <td style={{ width: 56 }}><div className="thumb" style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,.1)' }}><Thumb src={p.image} alt="" /></div></td>
                <td><b>{p.name}</b><div className="muted">{p.sku}</div></td>
                <td>{p.categoryName || '-'}</td><td>{kes(p.price)}</td><td>{p.status || 'ACTIVE'}</td><td>{p.stock ?? '-'}</td>
                <td><div className="row" style={{ justifyContent: 'flex-end' }}>
                  <button className="btn sm ghost" onClick={() => { setError(''); setForm({ id: p.id, name: p.name, slug: p.slug, price: p.price, sku: p.sku, categoryId: p.categoryId || '', description: p.description || '', imageUrl: p.image || '', originalImageUrl: p.image || '', status: p.status || 'ACTIVE' }); }}><Pencil size={14} />Edit</button>
                  <button className="btn sm danger" onClick={() => del(p)} aria-label={'Delete ' + p.name}><Trash2 size={14} /></button>
                </div></td>
              </tr>
            ))}
            {prods.data && !prods.data.length && <tr><td colSpan={7} className="muted">No products yet. Add your first appliance.</td></tr>}
          </tbody>
        </table>
      </div>
      {form && (
        <Modal title={form.id ? 'Edit product' : 'Add product'} onClose={() => setForm(null)}>
          <form className="stack" onSubmit={save}>
            <Field label="Product name" value={form.name} onChange={set('name')} required placeholder="Built-in 4 gas stainless hob" />
            <div className="cols2">
              <Field label="Price (KES)" type="number" min="0" value={form.price} onChange={set('price')} required />
              <Field label="Model / SKU" value={form.sku} onChange={set('sku')} required placeholder="BLS-ML-8402G" />
            </div>
            <Field label="Category" value={form.categoryId} onChange={set('categoryId')}>
              <option value="">No category</option>
              {asList(cats.data, 'categories').map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Field>
            <Field label="Description" textarea value={form.description} onChange={set('description')} placeholder="Size, cutout, features, warranty" />
            <Field icon={ImagePlus} label="Product image URL (editable)" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
            <Field label="Publishing status" value={form.status} onChange={set('status')}>
              <option value="DRAFT">Draft — hidden from customers</option>
              <option value="ACTIVE">Active — visible in shop</option>
              <option value="ARCHIVED">Archived — not for sale</option>
            </Field>
            <Err>{error}</Err>
            <button className="btn flame" disabled={busy}>{busy && <Spin />}Save product</button>
          </form>
        </Modal>
      )}
    </>
  );
}
