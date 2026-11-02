import Link from 'next/link';
import { Flame, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap cols">
        <div>
          <div className="logo" style={{ color: '#fff' }}><Flame size={24} />BOLESI</div>
          <p>Gas hobs, ovens, water heaters, water purifiers, smart locks and more. Free one-year warranty, free measuring visit, and 24/7 after-sales service in Kenya.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link href="/products">All products</Link><Link href="/cart">Your cart</Link><Link href="/login">Sign in</Link>
        </div>
        <div>
          <h4>Visit a branch</h4>
          <a href="tel:+254116484838"><Phone size={14} style={{ display: 'inline', marginRight: 6 }} />Nakuru Flagship +254 116 484 838</a>
          <a href="tel:0116896528"><MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />Karibu Square, Kilimani 0116 896 528</a>
          <a href="tel:0748245880"><MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />Hi Home, Garden City 0748 245 880</a>
        </div>
      </div>
      <div className="wrap" style={{ marginTop: 28, fontSize: 13 }}>© 2026 BOLESI Company Limited. All rights reserved.</div>
    </footer>
  );
}
