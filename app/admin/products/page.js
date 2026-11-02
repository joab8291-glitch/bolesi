'use client';
import { useRef, useState } from 'react';
import { Plus, Pencil, Trash2, ImagePlus, Save } from 'lucide-react';
import { api, asList, kes, normProduct } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { Field, Spin, Err, Thumb } from '@/components/ui';
import Modal from '@/components/Modal';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const blank = { name: '', slug: '', price: '', sku: '', categoryId: '', description: '', imageUrl: '', originalImageUrl: '', status: 'ACTIVE' };

export default function Products() {
  const prods = useFetch(() => api('/admin/products', { auth: true }).then((d) => asList(d, 'products').map(normProduct)), []);
  const cats = useFetch(() => api('/categories').then((d) => asList(d, 'categories')), []);
  const branches = useFetch(() => api('/branches').then((d) => asList(d, 'branches')), []);
  const [stockBranch, setStockBranch] = useState('');
  const [stockValues, setStockValues] = useState({});
  const [stockSaving, setStockSaving] = useState({});
  const [stockMessage, setStockMessage] = useState('');
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef(null);
  const set = (k) => (v) => setForm((s) => ({ ...s, [k]: v, ...(k === 'name' && !s.id ? { slug: slugify(v) } : {}) }));
  const getBranchStock = (p) => {
    const inv = p.inventory || p.inventories || p.branchStock || p.stocks || [];
    const row = Array.isArray(inv) ? inv.find((i) => String(i.branchId ?? i.branch?.id) === String(stockBranch)) : null;
    return row ? Number(row.quantity ?? row.available ?? 0) : 0;
  };
  async function saveStock(p) {
    if (!stockBranch) { setStockMessage('Choose a branch before editing stock.'); return; }
    const raw = stockValues[p.id] ?? getBranchStock(p);
    const quantity = Number(raw);
    if (!Number.isInteger(quantity) || quantity < 0) { setStockMessage('Stock must be a whole number of zero or more.'); return; }
    setStockSaving((v) => ({ ...v, [p.id]: true })); setStockMessage('');
    try {
      await api('/admin/inventory', { method: 'PUT', auth: true, body: { branchId: stockBranch, productId: p.id, quantity } });
      setStockMessage('Stock saved for ' + p.name + '.');
      prods.reload();
    } catch (err) { setStockMessage('Could not save stock: ' + err.message); }
    finally { setStockSaving((v) => ({ ...v, [p.id]: false })); }
  }

  async function chooseImage(file) {
    if (!file) return;
    setError('');
    if (!file.type.startsWith('image/')) { setError('Choose an image file (JPG, PNG, WebP, or GIF).'); return; }
    if (file.size > 3 * 1024 * 1024) { setError('Image is too large. Choose an image smaller than 3 MB.'); return; }
    setImageBusy(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Could not read this image. Please try another file.'));
        reader.readAsDataURL(file);
      });
      setForm((current) => ({ ...current, imageUrl: dataUrl }));
    } catch (err) {
      setError(err.message || 'Could not load image.');
    } finally {
      setImageBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

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
      <Err>{prods.error || branches.error}</Err>
      <div className="row wrapx" style={{ marginTop: 14, alignItems: 'end' }}>
        <div style={{ minWidth: 240, maxWidth: 360, flex: 1 }}>
          <Field label="Branch for stock editing" value={stockBranch} onChange={(v) => { setStockBranch(v); setStockValues({}); setStockMessage(''); }}>
            <option value="">Choose a branch…</option>
            {(branches.data || []).map((b) => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
          </Field>
        </div>
        {stockMessage && <span className="muted" role="status">{stockMessage}</span>}
      </div>
      <div className="glass tscroll" style={{ marginTop: 14 }}>
        <table className="tbl">
          <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Stock quantity</th><th></th></tr></thead>
          <tbody>
            {(prods.data || []).map((p) => (
              <tr key={p.id}>
                <td style={{ width: 56 }}><div className="thumb" style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,.1)' }}><Thumb src={p.image} alt="" /></div></td>
                <td><b>{p.name}</b><div className="muted">{p.sku}</div></td>
                <td>{p.categoryName || '-'}</td><td>{kes(p.price)}</td><td>{p.status || 'ACTIVE'}</td><td style={{ minWidth: 190 }}><div className="row wrapx"><input aria-label={'Stock quantity for ' + p.name} type="number" min="0" step="1" disabled={!stockBranch} value={stockValues[p.id] ?? getBranchStock(p)} onChange={(e) => setStockValues((v) => ({ ...v, [p.id]: e.target.value }))} style={{ width: 78, minWidth: 78, padding: '7px 8px', borderRadius: 8, border: '1px solid #9AAAB6', background: '#fff', color: '#17232D' }} /><button type="button" className="btn sm ghost" disabled={!stockBranch || !!stockSaving[p.id]} onClick={() => saveStock(p)}><Save size={13} />{stockSaving[p.id] ? 'Saving' : 'Save'}</button></div></td>
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
            <div className="fld">
              <span className="fld-l">Product image</span>
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload product image: drop an image here or choose a file"
                onClick={() => fileInput.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.current?.click(); } }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setDragging(false); chooseImage(e.dataTransfer.files?.[0]); }}
                style={{ border: '2px dashed ' + (dragging ? '#38B6FF' : 'rgba(184,201,214,.55)'), borderRadius: 14, padding: 18, textAlign: 'center', cursor: 'pointer', background: dragging ? 'rgba(56,182,255,.12)' : 'rgba(255,255,255,.035)' }}
              >
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Product image preview" style={{ width: 150, height: 120, objectFit: 'contain', margin: '0 auto 12px', borderRadius: 8, background: '#fff' }} />
                ) : (
                  <ImagePlus size={30} style={{ margin: '0 auto 8px', color: '#B8C9D6' }} />
                )}
                <strong style={{ display: 'block', color: '#F4F8FB' }}>{imageBusy ? 'Reading image…' : dragging ? 'Drop image to upload' : 'Drag and drop an image here'}</strong>
                <span style={{ display: 'block', color: '#B8C9D6', fontSize: 13, marginTop: 4 }}>or click to choose a file · JPG, PNG, WebP or GIF · Max 3 MB</span>
                <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(e) => chooseImage(e.target.files?.[0])} />
              </div>
              <Field icon={ImagePlus} label="Or use an image URL" value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
            </div>
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
