'use client';
import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, KeyRound } from 'lucide-react';
import AuthShell from '@/components/AuthShell';
import { Field, Spin, Err } from '@/components/ui';
import { api } from '@/lib/api';

export default function AdminSetup() {
  const [f, setF] = useState({ name: '', email: '', password: '', token: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await api('/auth/admin-bootstrap', { method: 'POST', headers: { 'x-admin-setup-token': f.token }, body: { name: f.name, email: f.email, password: f.password } });
      setDone(true);
    } catch (err) { setError(err.message); }
    setBusy(false);
  }
  return (
    <AuthShell title="Set up the super admin" sub="One-time setup. Use the ADMIN_SETUP_TOKEN from your Render environment." footer={<Link className="lnk" href="/login">Go to sign in</Link>}>
      {done ? (
        <div className="ok">Super admin created. <Link className="lnk" href="/login">Sign in now</Link>. For safety, remove ADMIN_SETUP_TOKEN from Render afterwards.</div>
      ) : (
        <form className="stack" onSubmit={submit}>
          <Field icon={KeyRound} label="Setup token" type="password" value={f.token} onChange={set('token')} required />
          <Field icon={User} label="Full name" value={f.name} onChange={set('name')} required />
          <Field icon={Mail} label="Admin email" type="email" value={f.email} onChange={set('email')} required />
          <Field icon={Lock} label="Password" type="password" value={f.password} onChange={set('password')} required minLength={8} />
          <Err>{error}</Err>
          <button className="btn flame" disabled={busy}>{busy && <Spin />}Create super admin</button>
        </form>
      )}
    </AuthShell>
  );
}
