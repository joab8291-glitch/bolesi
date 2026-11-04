'use client';
import { useState } from 'react';
import { Eye, EyeOff, ImageOff, Loader2, Microwave, CookingPot, WashingMachine } from 'lucide-react';

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
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const label = String(alt || '').toLowerCase();
  const isMicrowave = label.includes('microwave');
  const isDishwasher = label.includes('dishwasher');
  const isCooktop = label.includes('ceramic stove') || label.includes('electric cooker') || label.includes('electric hob');
  const isGasHob = label.includes('hob') || label.includes('gas cooker') || label.includes('gas stainless');
  const isSmartLock = label.includes('smart lock');
  const isOven = label.includes('oven');
  const isRangeHood = label.includes('range hood') || label.includes('kitchen hood');
  const isPurifier = label.includes('purifier');
  const isSmartToilet = label.includes('smart toilet');
  const isGasHeater = label.includes('gas water heater');
  const isStorageHeater = label.includes('storage') && label.includes('water heater');
  const isWaterHeater = label.includes('water heater');
  // Use the built-in product placeholder instead of fragile third-party fallback images.
  const fallbackSrc = null;
  const FallbackIcon = isMicrowave ? Microwave : isDishwasher ? WashingMachine : isCooktop || isGasHob ? CookingPot : ImageOff;
  const fallbackLabel = isMicrowave ? 'Microwave' : isDishwasher ? 'Dishwasher' : isCooktop ? 'Electric cooker' : isGasHob ? 'Cooker hob' : 'Product photo';

  if ((!src || failed) && fallbackSrc && !fallbackFailed) {
    return <img src={fallbackSrc} alt={alt || ''} width="640" height="480" loading="lazy" decoding="async" onError={() => setFallbackFailed(true)} />;
  }
  if (!src || failed) {
    return (
      <div className="thumb-fallback" role="img" aria-label={alt ? alt + ' image could not be loaded' : 'Product image could not be loaded'}>
        <FallbackIcon size={34} aria-hidden="true" />
        <span>{fallbackLabel}</span>
      </div>
    );
  }
  return <img src={src} alt={alt || ''} width="640" height="480" loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

export function Empty({ children }) { return <div className="empty">{children}</div>; }
export function Err({ children }) { return children ? <div className="err" role="alert">{children}</div> : null; }
