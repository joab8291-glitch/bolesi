const BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000').replace(/\/$/, '');

export function getToken() {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('bolesi_token'); } catch { return null; }
}

export async function api(path, { method = 'GET', body, auth = false, headers = {} } = {}) {
  const h = { 'Content-Type': 'application/json', ...headers };
  const t = getToken();
  if (auth && t) h.Authorization = 'Bearer ' + t;
  let res;
  try {
    res = await fetch(BASE + '/api' + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
  } catch {
    throw new Error('Cannot reach the BOLESI server. It may be waking up, so try again in a few seconds.');
  }
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const e = new Error((data && (data.error || data.message)) || 'Request failed (' + res.status + ')');
    e.status = res.status;
    throw e;
  }
  return data;
}

export const asList = (d, k) => (Array.isArray(d) ? d : (d && (d[k] || d.items || d.data || d.results)) || []);

export const kes = (n) => 'KES ' + Number(n || 0).toLocaleString('en-KE');

export function normProduct(p) {
  if (!p) return null;
  const imgs = (p.images || []).map((i) => (typeof i === 'string' ? i : i.url)).filter(Boolean);
  const inv = p.inventory || p.inventories || p.branchStock || p.stocks;
  const stock = typeof p.stock === 'number' ? p.stock : Array.isArray(inv) ? inv.reduce((s, i) => s + Number(i.quantity ?? i.available ?? 0), 0) : null;
  return {
    ...p,
    slug: p.slug || String(p.id),
    name: p.name || p.title || 'Product',
    price: Number(p.price ?? p.priceKes ?? p.priceKES ?? 0),
    images: imgs,
    image: imgs[0] || p.imageUrl || null,
    categoryName: p.category?.name || p.categoryName || '',
    categoryId: p.categoryId ?? p.category?.id,
    sku: p.sku || p.model || '',
    stock,
  };
}

export function normOrder(o) {
  if (!o) return null;
  return {
    ...o,
    number: o.orderNumber || o.number || o.id,
    total: Number(o.total ?? o.totalAmount ?? o.totalKes ?? 0),
    status: o.status || 'PENDING',
    payStatus: o.paymentStatus || o.payment?.status || '',
    items: (o.items || o.orderItems || []).map((i) => ({
      name: i.name || i.product?.name || 'Item',
      qty: Number(i.quantity ?? i.qty ?? 1),
      price: Number(i.unitPrice ?? i.price ?? 0),
    })),
  };
}
