import React, { useRef, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ScratchCardProps {
  amount: number;
  onComplete?: () => void;
}

export default function ScratchCard({ amount, onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Draw scratch layer (Silver Gradient)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#E2E8F0');
    gradient.addColorStop(0.5, '#CBD5E1');
    gradient.addColorStop(1, '#94A3B8');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise texture to make it look metallic
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(x, y, 1, 1);
    }

    // Add "Scratch Me" text
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: (e as MouseEvent).clientX - rect.left,
      y: (e as MouseEvent).clientY - rect.top
    };
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!isDrawing || isScratched) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getPos(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) transparentPixels++;
    }

    const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
    if (percentage > 45 && !isScratched) {
      setIsScratched(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '140px',
      background: '#F8FAFC',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '2px dashed #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Revealed Content */}
      <div style={{
        textAlign: 'center',
        opacity: isScratched ? 1 : 0.3,
        transform: isScratched ? 'scale(1)' : 'scale(0.95)',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px',
          marginBottom: '4px'
        }}>
          <Sparkles size={20} color="#6E54FF" />
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: 700, 
            color: '#6E54FF',
            letterSpacing: '0.05em'
          }}>YOU WON</span>
        </div>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          margin: 0,
          color: '#0F172A',
          letterSpacing: '-0.02em',
          lineHeight: 1
        }}>
          {amount.toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: 600 }}>MON</span>
        </h2>
        {isScratched && (
            <p style={{ 
                margin: '8px 0 0', 
                fontSize: '0.75rem', 
                color: '#64748B',
                fontWeight: 500 
            }}>Successfully credited to MonVault</p>
        )}
      </div>

      {/* Scratch Layer */}
      <canvas
        ref={canvasRef}
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        onMouseMove={scratch}
        onTouchStart={() => setIsDrawing(true)}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={scratch}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: isScratched ? 'default' : 'crosshair',
          transition: 'opacity 0.5s ease',
          opacity: isScratched ? 0 : 1,
          pointerEvents: isScratched ? 'none' : 'auto'
        }}
      />
    </div>
  );
}
