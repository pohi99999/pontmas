"use client";

import React, { useEffect, useState } from 'react';
import { useAccessibility } from '@/context/SensoryContext';

export default function ReadingRuler() {
  const { readingRuler } = useAccessibility();
  const [mouseY, setMouseY] = useState<number | null>(null);

  useEffect(() => {
    if (!readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingRuler]);

  if (!readingRuler || mouseY === null) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 z-50 transition-all duration-75 ease-out"
      style={{ top: `${mouseY - 30}px`, height: '60px' }}
    >
      <div className="h-full w-full border-y-2 border-blue-500/40 bg-blue-400/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]" />
    </div>
  );
}
