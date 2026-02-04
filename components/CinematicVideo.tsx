import React, { useRef, useEffect } from 'react';

interface CinematicVideoProps {
  onComplete: () => void;
}

const CinematicVideo: React.FC<CinematicVideoProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('CinematicVideo component mounted');
    const video = videoRef.current;
    if (video) {
      console.log('Video element found, attempting to play');
      video.play().catch((error) => {
        console.error('Video play failed:', error);
        // Fallback: call onComplete after 5 seconds if video fails to play
        setTimeout(onComplete, 5000);
      });

      const handleEnded = () => {
        console.log('Video ended');
        onComplete();
      };

      const handleLoadedData = () => {
        console.log('Video loaded');
      };

      const handleError = (e: any) => {
        console.error('Video error:', e);
      };

      video.addEventListener('ended', handleEnded);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      // Fallback: call onComplete after 30 seconds if video doesn't end
      const fallbackTimeout = setTimeout(() => {
        console.log('Fallback timeout triggered');
        onComplete();
      }, 30000);

      return () => {
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        clearTimeout(fallbackTimeout);
      };
    }
  }, [onComplete]);

  return (
    <div className="cinematic-video">
      <video
        ref={videoRef}
        src="/assets/videos/globe.mp4"
        muted
        autoPlay
        playsInline
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      />
      <button
        onClick={onComplete}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        Skip Video
      </button>
    </div>
  );
};

export default CinematicVideo;
