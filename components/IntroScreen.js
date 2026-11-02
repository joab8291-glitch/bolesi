'use client';
import { useEffect, useState } from 'react';

export default function IntroScreen() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Show a short brand intro before revealing the store on each fresh visit.
    setVisible(true);
    const timer = window.setTimeout(() => { setVisible(false); setReady(true); }, 4500);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible || ready) return null;
  return (
    <div className="intro-screen" role="status" aria-label="BOLESI welcome">
      <video className="intro-screen-video" autoPlay muted playsInline preload="auto" onEnded={() => { setVisible(false); setReady(true); }}>
        <source src="/bolesi-intro.mp4" type="video/mp4" />
      </video>
      <div className="intro-screen-shade" />
      <img src="/bolesi-logo.png" alt="BOLESI" className="intro-screen-logo" />
      <div className="intro-screen-loading"><span /> Preparing your home appliance experience</div>
      <button className="intro-skip" onClick={() => { setVisible(false); setReady(true); }}>Skip intro</button>
    </div>
  );
}