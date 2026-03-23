import { useEffect, useRef } from 'react';

function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Harmonic wave parameters
    let time = 0;
    const waveCount = 5;
    const pointsPerWave = 80;

    const render = () => {
      time += 0.005;
      
      // Paint background
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 100;

      // Draw layered parametric waves creating a cosmic/digital mesh
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        for (let j = 0; j <= pointsPerWave; j++) {
          
          const progress = j / pointsPerWave;
          const xPos = progress * canvas.width;
          
          // Complex mathematical layering
          const offset = i * (Math.PI / waveCount);
          const yWave1 = Math.sin(progress * Math.PI * 4 + time + offset) * 80;
          const yWave2 = Math.cos(progress * Math.PI * 2 - time * 1.5) * 60;
          const depthScale = Math.sin(time + i) * 30; // Creates breathing effect
          
          const yPos = cy - (i * 60) + yWave1 + yWave2 + depthScale;

          if (j === 0) {
            ctx.moveTo(xPos, yPos);
          } else {
            ctx.lineTo(xPos, yPos);
          }
          
          // Draw subtle nodes on the wave
          if (j % 5 === 0) {
            ctx.fillStyle = `rgba(147, 197, 253, ${0.1 + (i*0.05)})`;
            ctx.beginPath();
            ctx.arc(xPos, yPos, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.moveTo(xPos, yPos); // reset path tracer
          }
        }
        
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + (i / waveCount) * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[-10] pointer-events-none block"
    />
  );
}

export default AnimatedBackground;
