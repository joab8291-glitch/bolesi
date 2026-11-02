import Header from '@/components/Header';

export default function StoreLayout({ children }) {
  return (<><Header /><main>{children}</main></>);
}
