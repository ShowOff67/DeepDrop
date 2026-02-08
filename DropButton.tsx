import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TimingMode } from './types';

interface DropButtonProps {
  mode: TimingMode;
  onStart: () => void;
  onStop: (duration: number) => void;
  isRunning: boolean;
}

export const DropButton: React.FC<DropButtonProps> = ({ 
  mode, 
  onStart, 
  onStop, 
  isRunning 
}) => {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number>();

  const animate = useCallback((time: number) => {
    if (startTimeRef.current !== null) {
      setElapsed((time - startTimeRef.current) / 1000);
      requestRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      startTimeRef.current = null;
      setElapsed(0);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, animate]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (mode === TimingMode.HOLD && !isRunning) {
      e.currentTarget.setPointerCapture(e.pointerId);
      onStart();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (mode === TimingMode.HOLD && isRunning) {
      onStop(elapsed);
    }
  };

  const handleClick = () => {
    if (mode === TimingMode.TAP) {
      isRunning ? onStop(elapsed) : onStart();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-6xl font-black tabular-nums tracking-tighter text-emerald-400">
        {elapsed.toFixed(3)}s
      </div>
      
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        className={`
          relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-300 touch-none
          ${isRunning 
            ? 'bg-red-500 scale-95 shadow-[0_0_50px_rgba(239,68,68,0.4)]' 
            : 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
          }
        `}
      >
        <div className="text-center">
          <span className="block text-2xl font-extrabold uppercase tracking-widest text-white">
            {isRunning ? 'STOP' : 'DROP'}
          </span>
          <span className="block text-xs font-medium opacity-60 mt-1 uppercase">
            {mode === TimingMode.HOLD ? 'Hold to Measure' : 'Tap to Start/Stop'}
          </span>
        </div>

        {isRunning && (
          <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-25"></div>
        )}
      </button>
    </div>
  );
};