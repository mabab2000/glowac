import React, { useEffect, useState, useRef } from 'react';

const ScrollProgressCircle: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const r = 16; // radius
  const stroke = 3;
  const circumference = 2 * Math.PI * r;
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      if (mountedRef.current) setProgress(pct);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const offset = circumference * (1 - progress);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <button
        aria-label="Scroll progress — click to go to top"
        onClick={handleClick}
        className="w-12 h-12 bg-white/8 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105"
        title="Scroll to top"
      >
        <svg className="-rotate-90" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <g transform="translate(20,20)">
            <circle
              r={r}
              cx={0}
              cy={0}
              fill="transparent"
              stroke="rgba(16,185,129,0.12)"
              strokeWidth={stroke}
            />
            <circle
              r={r}
              cx={0}
              cy={0}
              fill="transparent"
              stroke="#10B981"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 150ms linear' }}
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default ScrollProgressCircle;
