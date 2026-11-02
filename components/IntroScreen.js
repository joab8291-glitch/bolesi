'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function IntroScreen() {
  const pathname = usePathname();
  const isAdminRoute = pathname === '/admin' || pathname?.startsWith('/admin/') || pathname === '/login';

  // The cinematic intro is for the storefront only. Never let a blocked video
  // cover the admin panel or the login page.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isAdminRoute) {
      setVisible(false);
      return;
    }

    // Play the intro only once per browser tab/session, not on every route change.
    try {
      if (sessionStorage.getItem('bolesi-intro-played') === '1') {
        setVisible(false);
        return;
      }
      sessionStorage.setItem('bolesi-intro-played', '1');
    } catch {}

    setVisible(true);
    const video = document.querySelector('.intro-screen-video');
    if (!video) return;

    const finish = () => {
      setVisible(false);
      try { video.pause(); } catch {}
    };
    const start = () => {
      video.classList.add('is-playing');
    };

    video.addEventListener('playing', start);
    video.addEventListener('ended', finish);
    video.play().catch(() => {
      // If autoplay is blocked, release the cover instead of trapping the user.
      finish();
    });

    return () => {
      video.removeEventListener('playing', start);
      video.removeEventListener('ended', finish);
    };
  }, [pathname, isAdminRoute]);

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
