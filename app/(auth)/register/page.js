'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock } from 'lucide-react';
import AuthShell from '@/components/AuthShell';
import { Field, Spin, Err } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await api('/auth/register', { method: 'POST', body: f });
      await login(f.email, f.password);
      router.push('/');
    } catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <AuthShell title="Create your account" sub="Save your details and follow every order." footer={<>Already registered? <Link className="lnk" href="/login">Sign in</Link></>}>
      <form className="stack" onSubmit={submit}>
        <Field icon={User} label="Full name" value={f.name} onChange={set('name')} required autoComplete="name" />
        <Field icon={Mail} label="Email" type="email" value={f.email} onChange={set('email')} required autoComplete="email" />
        <Field icon={Phone} label="Phone" value={f.phone} onChange={set('phone')} placeholder="07XX XXX XXX" inputMode="tel" autoComplete="tel" />
        <Field icon={Lock} label="Password" type="password" value={f.password} onChange={set('password')} required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
        <Err>{error}</Err>
        <button className="btn flame" disabled={busy}>{busy && <Spin />}Create account</button>
      </form>
    </AuthShell>
  );
}
