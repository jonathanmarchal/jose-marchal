'use client';

import { useEffect, useRef } from 'react';

export default function HeroLabel() {
  const labelRef = useRef(null);

  useEffect(() => {
    const label = labelRef.current;
    if (!label) return;

    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY || 0;
      const heroProgress = Math.min(y / Math.max(window.innerHeight, 1), 1);
      const moveY = heroProgress * -72;
      const moveX = heroProgress * 18;
      const rotate = heroProgress * -6;
      label.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotate}deg)`;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hero-label" data-parallax="0.22" ref={labelRef}>
      <img src="/assets/arrow-down-left.png" alt="" aria-hidden="true" />
      <p>Dirigente &<br />Alt</p>
    </div>
  );
}
