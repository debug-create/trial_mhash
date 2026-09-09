'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export function DriftTrendChart({ trend }: { trend: number[] }) {
  // Convert trend array (e.g. [98, 92, 85, 70, 52]) into SVG path coordinates
  const width = 280;
  const height = 60;
  const points = trend.map((val, idx) => {
    const x = (idx / (trend.length - 1)) * width;
    const y = height - (val / 100) * height;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;
  const currentVal = trend[trend.length - 1];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-slate-300 font-mono">
        <span className="flex items-center gap-1.5 text-indigo-400">
          <TrendingUp className="h-3.5 w-3.5" /> 30-Day Adherence Drift Trajectory
        </span>
        <span className="font-mono text-xs text-slate-400">
          Current: <strong className={currentVal >= 80 ? 'text-emerald-400' : currentVal >= 65 ? 'text-amber-400' : 'text-rose-400'}>{currentVal}%</strong>
        </span>
      </div>

      <div className="relative w-full h-[60px] overflow-hidden pt-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Background Grid Lines */}
          <line x1="0" y1="15" x2={width} y2="15" stroke="#1e293b" strokeDasharray="3,3" />
          <line x1="0" y1="45" x2={width} y2="45" stroke="#1e293b" strokeDasharray="3,3" />

          {/* Animated Trajectory Path */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={currentVal >= 80 ? '#10b981' : currentVal >= 65 ? '#f59e0b' : '#f43f5e'}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* Glowing Target Dot at End */}
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].split(',')[0]}
              cy={points[points.length - 1].split(',')[1]}
              r="4"
              fill={currentVal >= 80 ? '#10b981' : currentVal >= 65 ? '#f59e0b' : '#f43f5e'}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
