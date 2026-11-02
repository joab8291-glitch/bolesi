'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api, asList } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { Field, Spin, Err } from '@/components/ui';
import Modal from '@/components/Modal';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function Categories() {
  const cats = useFetch(() => api('/categories').then((d) => asList(d, 'categories')), []);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function save(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const body = { name: form.name, slug: slugify(form.name), description: form.description || undefined };
      form.id ? await api('/admin/categories/' + form.id, { method: 'PATCH', body, auth: true }) : await api('/admin/categories', { method: 'POST', body, auth: true });
      setForm(null); cats.reload();
    } catch (err) { setError(err.message); }
    setBusy(false);
  }
  async function del(c) {
    if (!confirm('Delete category ' + c.name + '?')) return;
    try { await api('/admin/categories/' + c.id, { method: 'DELETE', auth: true }); cats.reload(); } catch (err) { alert(err.message); }
  }
  return (
    <>
      <div className="row between wrapx"><div><h1>Categories</h1><p className="muted">Group products so customers can browse them.</p></div>
        <button className="btn flame" onClick={() => { setError(''); setForm({ name: '', description: '' }); }}><Plus size={18} />Add category</button></div>
      <Err>{cats.error}</Err>
      <div className="glass" style={{ marginTop: 14 }}>
        <table className="tbl"><tbody>
          {(cats.data || []).map((c) => (
            <tr key={c.id}><td><b>{c.name}</b><div className="muted">{c.description}</div></td>
              <td><div className="row" style={{ justifyContent: 'flex-end' }}>
                <button className="btn sm ghost" onClick={() => { setError(''); setForm({ id: c.id, name: c.name, description: c.description || '' }); }}><Pencil size={14} />Edit</button>
                <button className="btn sm danger" onClick={() => del(c)} aria-label={'Delete ' + c.name}><Trash2 size={14} /></button></div></td></tr>
          ))}
          {cats.data && !cats.data.length && <tr><td className="muted">No categories yet.</td></tr>}
        </tbody></table>
      </div>
      {form && (
        <Modal title={form.id ? 'Edit category' : 'Add category'} onClose={() => setForm(null)}>
          <form className="stack" onSubmit={save}>
            <Field label="Category name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required placeholder="Built-in hobs" />
            <Field label="Description (optional)" textarea value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
            <Err>{error}</Err>
            <button className="btn flame" disabled={busy}>{busy && <Spin />}Save category</button>
          </form>
        </Modal>
      )}
    </>
  );
}
