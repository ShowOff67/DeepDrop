import React from 'react';
import { HeightResult } from './types';

interface DropGraphProps {
  result: HeightResult;
  totalTime: number;
}

export const DropGraph: React.FC<DropGraphProps> = ({ result, totalTime }) => {
  if (totalTime <= 0 || result.meters <= 0) return null;

  const width = 300;
  const height = 150;
  const padding = 20;

  const scaleX = (t: number) => padding + (t / totalTime) * (width - 2 * padding);
  const scaleY = (h: number) => height - padding - (h / result.meters) * (height - 2 * padding);

  let fallPath = `M ${scaleX(0)} ${scaleY(0)}`;
  const segments = 20;
  const g = 9.80665;
  
  for (let i = 1; i <= segments; i++) {
    const t = (i / segments) * result.fallTime;
    const h = 0.5 * g * t * t;
    fallPath += ` L ${scaleX(t)} ${scaleY(h)}`;
  }

  const soundPath = `M ${scaleX(result.fallTime)} ${scaleY(result.meters)} L ${scaleX(totalTime)} ${scaleY(0)}`;

  return (
    <div className="w-full bg-zinc-900/30 rounded-2xl border border-zinc-800/50 p-4 mt-4">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Physics Trajectory</span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] text-zinc-400">Fall</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <span className="text-[10px] text-zinc-400">Sound</span>
          </div>
        </div>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-lg">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#27272a" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#27272a" strokeWidth="1" />
        
        <path d={fallPath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={soundPath} fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" />
        
        <circle cx={scaleX(0)} cy={scaleY(0)} r="4" fill="#10b981" />
        <circle cx={scaleX(result.fallTime)} cy={scaleY(result.meters)} r="4" fill="#ef4444" />
        <circle cx={scaleX(totalTime)} cy={scaleY(0)} r="4" fill="#fbbf24" />

        <text x={scaleX(totalTime)} y={height - 2} textAnchor="end" fill="#52525b" fontSize="8" fontWeight="bold">{totalTime.toFixed(2)}s</text>
        <text x={padding - 5} y={padding + 5} textAnchor="end" fill="#52525b" fontSize="8" fontWeight="bold" transform={`rotate(-90, ${padding - 5}, ${padding + 5})`}>{result.meters.toFixed(0)}m</text>
      </svg>
    </div>
  );
};