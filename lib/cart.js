'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('bolesi_cart') || '[]')); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('bolesi_cart', JSON.stringify(items)); } catch {}
  }, [items]);

  const value = useMemo(() => ({
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
    add: (p, qty = 1) => setItems((cur) => {
      const f = cur.find((i) => i.id === p.id);
      if (f) return cur.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
      return [...cur, { id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.image, qty }];
    }),
    setQty: (id, qty) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))),
    remove: (id) => setItems((cur) => cur.filter((i) => i.id !== id)),
    clear: () => setItems([]),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
