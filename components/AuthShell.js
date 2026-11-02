import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function AuthShell({ title, sub, children, footer }) {
  return (
    <div className="auth">
      <span className="orb a" /><span className="orb b" /><span className="orb c" />
      <div className="glass">
        <Link href="/" className="logo"><Flame size={26} />BOLESI</Link>
        <h1>{title}</h1>
        <p className="sub">{sub}</p>
        {children}
        {footer && <p className="sub" style={{ margin: '18px 0 0', textAlign: 'center' }}>{footer}</p>}
      </div>
    </div>
  );
}
