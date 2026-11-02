import Link from 'next/link';
import { MapPin, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" aria-label="BOLESI home" className="footer-logo-link">
            <img src="/bolesi-logo.png" alt="BOLESI" />
          </Link>
          <p>Thoughtfully designed home appliances for modern Kenyan homes.</p>
          <p className="footer-support">Quality appliances. Reliable support. Everyday comfort.</p>
        </div>
        <div>
          <h3>Contact BOLESI Kenya</h3>
          <p><a href="https://www.bolesi-kenya.com/" target="_blank" rel="noreferrer">Official website <ArrowUpRight size={14} style={{display:'inline',verticalAlign:'middle'}} /></a></p>
          <p><MapPin size={15} style={{display:'inline',verticalAlign:'middle',marginRight:7}} />China Square, Karen — Waterfront Mall: <a href="tel:0785778215">0785 778 215</a></p>
          <p><MapPin size={15} style={{display:'inline',verticalAlign:'middle',marginRight:7}} />China Square, Ruaka: <a href="tel:0756663880">0756 663 880</a></p>
          <p><MapPin size={15} style={{display:'inline',verticalAlign:'middle',marginRight:7}} />China Square, Two Rivers: <a href="tel:0799373265">0799 373 265</a></p>
          <p><Mail size={15} style={{display:'inline',verticalAlign:'middle',marginRight:7}} /><a href="mailto:331688723@qq.com">331688723@qq.com</a></p>
        </div>
        <div>
          <h3>Shop & support</h3>
          <p><Link href="/products">Shop all appliances</Link></p>
          <p><Link href="/cart">View your cart</Link></p>
          <p><Link href="/login">Customer sign in</Link></p>
          <p>Free delivery and installation within Nairobi.</p>
          <p>One-year product warranty.</p>
        </div>
      </div>
      <div className="footer-bottom">© 2026 BOLESI Kenya. All rights reserved.</div>
    </footer>
  );
}
