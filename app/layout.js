import './globals.css';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import Providers from './providers';
import IntroScreen from '@/components/IntroScreen';

const head = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-head', weight: ['600', '700', '800'] });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: 'BOLESI Kenya | Built-in hobs, ovens, water heaters and smart locks',
  description: 'Shop BOLESI home appliances with free delivery and installation within Nairobi and a free one-year warranty.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={head.variable + ' ' + body.variable}>
      <head><link rel="preload" as="video" href="/bolesi-intro.mp4" type="video/mp4" /></head>
      <body><IntroScreen /><Providers>{children}</Providers></body>
    </html>
  );
}
