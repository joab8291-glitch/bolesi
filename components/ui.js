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
  const fallbackSrc = isMicrowave
    ? 'https://image.made-in-china.com/202f0j00gNdczvwJUyqn/20L-Solo-Microwave-Oven-Mechanical-Countertop-Microwave-Table-Microwave.webp'
    : isDishwasher
      ? 'https://www.joegraham.co.uk/media/misc/matrix_mdi6011_1341249_34-0100-0341.png'
      : isCooktop
        ? 'https://s.alicdn.com/@sc04/kf/Hb2c1984cb8ad478eae1877366cfc9550w/Induction-and-Ceramic-Mix-Hob-Touch-Screen-2-Plate-Black-Crystal-Plate-Cooker-Induction-Hob-with-Ceramic-Top.jpg'
        : isSmartLock
          ? 'https://cdn.xuansiwei.com/liuji7923/1701137581371/tupian%2016.png?x-oss-process=style%2Fpng_small'
          : isOven
            ? 'https://cdn.xuansiwei.com/liuji7923/1776104519469/tupian2_r__1446-1412_c__0c0c0d_.png?x-oss-process=style%2Fpng_small'
            : isRangeHood
              ? 'https://cdn.xuansiwei.com/liuji7923/1701137762425/tupian%206.png?x-oss-process=style%2Fpng_small'
              : isPurifier
                ? 'https://static.wixstatic.com/media/e1931c_a6936a88ed874cafb077319532286bec~mv2.webp/v1/fill/w_640%2Ch_640%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/e1931c_a6936a88ed874cafb077319532286bec~mv2.webp'
                : isSmartToilet
                  ? 'https://hwell-wc.com/uppic/i8-1.jpg'
                  : isGasHeater
                    ? 'https://www.noritz.com.cn/upload/product/202504091702580026.png'
                    : isStorageHeater
                      ? 'https://static.euroterm24.pl/GA/L0/70/-0/1-/05/00/00/0/BIG.jpg?hash=284a4d0215878bf6ebed94a4664dd04c'
                      : isWaterHeater
                        ? 'https://cdn.xuansiwei.com/liuji7923/1701137528586/tupian%2020.png?x-oss-process=style%2Fpng_small'
                        : isGasHob
                          ? 'https://cdn.xuansiwei.com/liuji7923/1701137816768/tupian%203.png?x-oss-process=style%2Fpng_small'
                          : null;
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
