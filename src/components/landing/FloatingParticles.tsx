
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface FloatingParticlesProps {
  count?: number;
  color?: string;
}

export const FloatingParticles = ({
  count = 50,
  color = "#F1C40F"
}: FloatingParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        initParticles();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    function initParticles() {
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1,
          color
        });
      }
    }

    function drawParticle(particle: Particle) {
      if (!ctx) return;
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      
      // Draw a pixel-art style particle (small square)
      const size = Math.floor(particle.size);
      ctx.fillRect(
        Math.floor(particle.x), 
        Math.floor(particle.y), 
        size, 
        size
      );
    }

    function updateParticle(particle: Particle) {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around screen edges
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.y > canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = canvas.height;
      
      // Slightly change opacity for twinkling effect
      particle.opacity += Math.random() * 0.02 - 0.01;
      if (particle.opacity < 0.1) particle.opacity = 0.1;
      if (particle.opacity > 0.6) particle.opacity = 0.6;
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};
