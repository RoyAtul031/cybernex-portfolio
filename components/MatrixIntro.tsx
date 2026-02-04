import React, { useEffect, useRef } from 'react';

interface MatrixIntroProps {
  onComplete: () => void;
}

const MatrixIntro: React.FC<MatrixIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const letters = '01ABCDEFXYZ01001101USER_ACCESS_GRANTED';
    const splitLetters = letters.split('');
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    
    // Arrays to store state for each column
    const drops: number[] = [];
    const speeds: number[] = [];

    for (let i = 0; i < columns; i++) {
       // Random starting position
       drops[i] = Math.random() * (canvas.height / fontSize);
       
       // Speed determines direction: Positive = Down, Negative = Up
       // 80% chance of standard falling code, 20% chance of "uploading" code
       const isUpward = Math.random() > 0.8;
       // Speed roughly between 0.5 and 1.5
       const speed = Math.random() * 1.0 + 0.5;
       
       speeds[i] = isUpward ? -speed : speed;
    }

    let frames = 0;
    const maxFrames = 250; // Duration ~4 seconds @ 60fps

    const draw = () => {
      // Fade effect to create trails
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = splitLetters[Math.floor(Math.random() * splitLetters.length)];
        const isUpward = speeds[i] < 0;

        // Visual distinction: Upward streams are slightly more cyan, Downward are green
        ctx.fillStyle = isUpward ? '#0ea5e9' : '#00ff41';

        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillText(text, x, y);

        // Move the drop
        drops[i] += speeds[i];

        // Recycle drops
        // For downward streams that go off bottom
        if (!isUpward && drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        // For upward streams that go off top
        if (isUpward && drops[i] * fontSize < 0 && Math.random() > 0.975) {
           drops[i] = canvas.height / fontSize;
        }
      }

      frames++;
      if (frames < maxFrames) {
        requestAnimationFrame(draw);
      } else {
        onComplete();
      }
    };

    const interval = requestAnimationFrame(draw);

    return () => {
        cancelAnimationFrame(interval);
        window.removeEventListener('resize', resize);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black cursor-pointer overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-cyber text-white font-bold animate-pulse tracking-widest bg-black/50 px-6 py-4 border border-green-500/30 backdrop-blur-sm shadow-[0_0_25px_rgba(0,255,65,0.3)]">
          INITIALIZING CYBERNEX
        </h1>
      </div>
    </div>
  );
};

export default MatrixIntro;