import React, { useEffect, useRef, useState } from 'react';

const bannerData = {
  video: '/images/glow_vide.mp4'
};

const Banner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState<boolean | undefined>(undefined);


  // Preload video
  useEffect(() => {
    let mounted = true;
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadeddata = () => {
      if (mounted) setVideoLoaded(true);
    };
    video.onerror = () => {
      if (mounted) setVideoLoaded(false);
    };
    video.src = bannerData.video;
    return () => { mounted = false; };
  }, []);

  // Ensure video plays when loaded
  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [videoLoaded]);

  // Create a loading UI while video loads
  if (videoLoaded === undefined) {
    return (
      <section className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white py-20 lg:py-28 overflow-hidden border-t border-gray-200 min-h-[70vh] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-widest uppercase drop-shadow-lg">GLOWAC</h2>
              <div className="mt-2 h-1 w-28 bg-white/30 rounded-full" />
            </div>

            <svg className="animate-spin h-20 w-20 text-emerald-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>

            <div className="text-center">
              <p className="mt-2 text-lg sm:text-xl font-medium text-white/95">Loading</p>
              <div className="mt-1 text-white/80">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse delay-75">.</span>
                <span className="animate-pulse delay-150">.</span>
              </div>
              <p className="mt-3 text-white/80">Preparing video — this may take a moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If video failed to load, return null
  if (videoLoaded === false) return null;

  return (
    <section className="relative bg-transparent py-20 lg:py-28 overflow-hidden min-h-[110vh] mt-16">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={bannerData.video}
          preload="auto"
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </section>
  );
};

export default Banner;
