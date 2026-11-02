import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowUpRight, ShieldCheck, Truck, Wrench } from 'lucide-react';

const contactGroups = [
  {
    title: 'BOLESI appliance outlets',
    locations: [
      ['China Square, Karen — Waterfront Mall', '0785778215'],
      ['China Square, Ruaka', '0756663880'],
      ['China Square, Two Rivers', '0799373265'],
      ['China Square KU, Unicity Mall', '0111671629'],
      ['China Village, Juja City Mall', '0106728188'],
    ],
  },
  {
    title: 'Golden Diamond & retail partners',
    locations: [
      ['China Village, Signature Mall', '0106528779'],
      ['Global Mart, Crystal Rivers', '0780037853'],
      ['Global Super Mart, Crystal Rivers', '0780037853'],
      ['Hi Home, Garden City', '0748245880'],
      ['Hi Home, Kiambu Road', '0755371959'],
    ],
  },
  {
    title: 'More locations',
    locations: [
      ['Hi Home, Langata', '0762870454'],
      ['Hi Home (China Mart), Nakuru', '0743962458'],
      ['Hi Mart, Milele Mall', '0718030782'],
      ['Karibu Square, Kilimani', '0116896528'],
      ['Love Home Mart, Diamond Plaza, Parklands', '0759011489'],
      ['Pandamart, Galleria', '0712507951'],
      ['Pandamart, Garden City', '0750125691'],
      ['Nakuru Flagship Store', '+254116484838'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner footer-inner-rich">
        <div className="footer-brand">
          <Link href="/" aria-label="BOLESI home" className="footer-logo-link">
            <img src="/bolesi-logo.png" alt="BOLESI" />
          </Link>
          <p>Home appliances designed for everyday comfort in Kenyan homes.</p>
          <p className="footer-support">Shop with confidence, with local product support.</p>
          <div className="footer-service-list">
            <span><Truck size={16} aria-hidden="true" /> Free delivery within Nairobi</span>
            <span><Wrench size={16} aria-hidden="true" /> Free installation within Nairobi</span>
            <span><ShieldCheck size={16} aria-hidden="true" /> One-year product warranty</span>
          </div>
          <p className="footer-official-link">
            <a href="https://bolesi-kenya.com/" target="_blank" rel="noreferrer">
              Official BOLESI Kenya website <ArrowUpRight size={14} style={{display:'inline',verticalAlign:'middle'}} />
            </a>
          </p>
          <p className="footer-email"><Mail size={15} aria-hidden="true" /><a href="mailto:331688723@qq.com">331688723@qq.com</a></p>
        </div>

        <div className="footer-contact-groups">
          {contactGroups.map((group) => (
            <section className="footer-contact-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.locations.map(([location, phone]) => (
                  <li key={location}>
                    <MapPin size={14} aria-hidden="true" />
                    <span>{location}<br /><a className="footer-phone" href={`tel:${phone.replace(/[^+\\d]/g, '')}`}><Phone size={12} aria-hidden="true" /> {phone}</a></span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="footer-shop-links">
          <h3>Shop & support</h3>
          <p><Link href="/products">Shop all appliances</Link></p>
          <p><Link href="/cart">View your cart</Link></p>
          <p><Link href="/login">Customer sign in</Link></p>
          <p className="footer-help-note">For product availability and in-store assistance, call the outlet nearest you.</p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} BOLESI Kenya. All rights reserved. Contact details sourced from the official BOLESI Kenya website.</div>
    </footer>
  );
}
