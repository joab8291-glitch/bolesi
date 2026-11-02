'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken } from './api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) { setReady(true); return; }
    api('/auth/me', { auth: true })
      .then((d) => setUser(d.user || d))
      .catch(() => { try { localStorage.removeItem('bolesi_token'); } catch {} })
      .finally(() => setReady(true));
  }, []);

  async function login(email, password) {
    const d = await api('/auth/login', { method: 'POST', body: { email, password } });
    const token = d.token || d.accessToken;
    if (!token) throw new Error('Sign-in succeeded but no token was returned.');
    localStorage.setItem('bolesi_token', token);
    const u = d.user || (await api('/auth/me', { auth: true }).then((x) => x.user || x));
    setUser(u);
    return u;
  }
  function logout() {
    try { localStorage.removeItem('bolesi_token'); } catch {}
    setUser(null);
  }
  const isAdmin = /admin/i.test(user?.role || '');
  return <Ctx.Provider value={{ user, ready, isAdmin, login, logout, setUser }}>{children}</Ctx.Provider>;
}
