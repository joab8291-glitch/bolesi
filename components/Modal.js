'use client';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass">
        <div className="row between" style={{ marginBottom: 16 }}>
          <h3>{title}</h3>
          <button className="icon-btn" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', borderColor: 'rgba(255,255,255,.25)' }} onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
