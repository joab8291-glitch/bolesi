'use client';
import { useState } from 'react';
import { Eye, EyeOff, ImageOff, Loader2 } from 'lucide-react';

export function Field({ icon: Icon, label, type = 'text', value, onChange, textarea, children, ...p }) {
  const [show, setShow] = useState(false);
  const pw = type === 'password';
  return (
    <label className="fld">
      <span className="fld-l">{label}</span>
      <span className={'fld-w' + (textarea ? ' ta' : '')}>
        {Icon && <Icon size={18} />}
        {textarea ? (
          <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...p} />
        ) : children ? (
          <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...p}>{children}</select>
        ) : (
          <input type={pw && show ? 'text' : type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...p} />
        )}
        {pw && (
          <button type="button" className="fld-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </span>
    </label>
  );
}

export const Spin = ({ size = 18 }) => <Loader2 size={size} style={{ animation: 'spin 1s linear infinite' }} />;

export function Thumb({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="thumb-fallback" role="img" aria-label={alt ? alt + ' image unavailable' : 'Product image unavailable'}>
        <ImageOff size={28} aria-hidden="true" />
        <span>Image unavailable</span>
      </div>
    );
  }
  return <img src={src} alt={alt || ''} loading="lazy" onError={() => setFailed(true)} />;
}

export function Empty({ children }) { return <div className="empty">{children}</div>; }
export function Err({ children }) { return children ? <div className="err" role="alert">{children}</div> : null; }
