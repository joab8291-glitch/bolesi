'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import AuthShell from '@/components/AuthShell';
import { Field, Spin, Err } from '@/components/ui';
import { useAuth } from '@/lib/auth';

function Form() {
  const { login } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const u = await login(email, password);
      router.push(next || (/admin/i.test(u?.role || '') ? '/admin' : '/'));
    } catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <AuthShell title="Welcome back" sub="Sign in to track orders and check out faster." footer={<>New to BOLESI? <Link className="lnk" href="/register">Create an account</Link></>}>
      <form className="stack" onSubmit={submit}>
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" placeholder="you@example.com" />
        <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} required autoComplete="current-password" placeholder="Your password" />
        <Err>{error}</Err>
        <button className="btn flame" disabled={busy}>{busy && <Spin />}Sign in</button>
      </form>
    </AuthShell>
  );
}
export default function Page() { return <Suspense><Form /></Suspense>; }
