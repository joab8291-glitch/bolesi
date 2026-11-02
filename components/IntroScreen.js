'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function IntroScreen() {
  const pathname = usePathname();
  const isAdminRoute = pathname === '/admin' || pathname?.startsWith('/admin/') || pathname === '/login';
  const [visible, setVisible] = useState(false);

  // Run playback logic only when the root layout mounts. Do not attach it to
  // pathname changes: cart/product navigation must never restart the intro.
  useEffect(() => {
    const isAdmin = window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin/') ||
      window.location.pathname === '/login';
    if (isAdmin) return;

    try {
      if (sessionStorage.getItem('bolesi-intro-played') === '1') return;
      // Mark before attempting playback, so rerenders/navigation cannot restart it.
      sessionStorage.setItem('bolesi-intro-played', '1');
    } catch {}

    const video = document.querySelector('.intro-screen-video');
    if (!video) return;

    setVisible(true);
    const finish = () => {
      setVisible(false);
      try { video.pause(); } catch {}
    };
    const start = () => video.classList.add('is-playing');

    video.addEventListener('playing', start);
    video.addEventListener('ended', finish);
    video.play().catch(finish);

    return () => {
      video.removeEventListener('playing', start);
      video.removeEventListener('ended', finish);
      video.pause();
    };
  }, []);

  if (isAdminRoute || !visible) return null;

  return (
    <div className="intro-screen" aria-label="BOLESI intro">
      <video className="intro-screen-video" autoPlay muted playsInline preload="auto" disablePictureInPicture aria-hidden="true">
        <source src="/bolesi-intro.mp4" type="video/mp4" />
      </video>
      <div className="intro-screen-shade" />
    </div>
  );
}
