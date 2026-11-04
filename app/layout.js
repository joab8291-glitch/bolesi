import './globals.css';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import Providers from './providers';

const head = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-head', weight: ['600', '700', '800'] });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  metadataBase: new URL('https://bolesi.webazi.co.ke'),
  title: 'BOLESI Kenya | Built-in hobs, ovens, water heaters and smart locks',
  description: 'Shop BOLESI home appliances with free delivery and installation within Nairobi and a free one-year warranty.',
  applicationName: 'BOLESI Kenya',
  openGraph: {
    type: 'website',
    siteName: 'BOLESI Kenya',
    url: 'https://bolesi.webazi.co.ke',
    title: 'BOLESI Kenya | Home Appliances',
    description: 'Shop BOLESI home appliances with delivery, installation and warranty options.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOLESI Kenya | Home Appliances',
    description: 'Shop BOLESI home appliances with delivery, installation and warranty options.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={head.variable + ' ' + body.variable}>
      <head>
        <link rel="preconnect" href="https://bolesi-backend.onrender.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://bolesi-backend.onrender.com" />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
