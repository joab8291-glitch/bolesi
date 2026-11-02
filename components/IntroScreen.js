'use client';
import { useEffect, useState } from 'react';

export default function IntroScreen() {
  // This component is rendered as part of the root layout HTML, before the storefront.
  // Keep the cover in place until the intro video finishes; never reveal the homepage first.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
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
      // Keep the full-screen cover visible if autoplay is blocked or the asset fails.
      // This prevents the homepage flashing before the intro has played.
      video.classList.add('intro-playback-blocked');
    });

    return () => {
      video.removeEventListener('playing', start);
      video.removeEventListener('ended', finish);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className="intro-screen" aria-label="BOLESI intro">
      <video className="intro-screen-video" autoPlay muted playsInline preload="auto" disablePictureInPicture aria-hidden="true">
        <source src="/bolesi-intro.mp4" type="video/mp4" />
      </video>
      <div className="intro-screen-shade" />
    </div>
  );
}