'use client';
import { useEffect, useState } from 'react';

export default function IntroScreen() {
  // Render the cover on the server so the store is never visible before the intro.
  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = document.querySelector('.intro-screen-video');
    let finished = false;
    let started = false;
    let startTimer;
    let capTimer;

    const finish = () => {
      if (finished) return;
      finished = true;
      setVisible(false);
      if (video) { try { video.pause(); } catch {} }
    };
    const fallback = () => {
      if (started || finished) return;
      if (video) video.remove();
      finish();
    };
    const onPlaying = () => {
      if (started || finished) return;
      started = true;
      clearTimeout(startTimer);
      setPlaying(true);
    };

    if (!video) {
      finish();
      return;
    }

    video.addEventListener('playing', onPlaying);
    video.addEventListener('ended', finish);
    startTimer = window.setTimeout(fallback, 15000);
    capTimer = window.setTimeout(finish, 60000);

    const playPromise = video.play();
    if (playPromise && playPromise.catch) playPromise.catch(fallback);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(capTimer);
      if (video) {
        video.removeEventListener('playing', onPlaying);
        video.removeEventListener('ended', finish);
      }
    };
  }, []);

  if (!visible) return null;
  return (
    <div className={'intro-screen' + (playing ? ' is-playing' : '')} role="status" aria-label="BOLESI welcome">
      <video className="intro-screen-video" autoPlay muted playsInline preload="auto" disablePictureInPicture aria-hidden="true">
        <source src="/bolesi-intro.mp4" type="video/mp4" />
      </video>
      <div className="intro-screen-shade" />
      <img src="/bolesi-logo.png" alt="BOLESI" className="intro-screen-logo" />
      <div className="intro-screen-loading"><span /> Preparing your home appliance experience</div>
      <button className="intro-skip" onClick={() => setVisible(false)}>Skip intro</button>
    </div>
  );
}