'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MedicationSupply } from '@/lib/types';

export function AnimatedDepletionMeter({ supply }: { supply: MedicationSupply }) {
  const stock = supply.currentStock;
  const leadTime = supply.deliveryLeadTimeHours;
  const daysRemaining = stock / (supply.dailyConsumption || 1);
  const fillPercent = Math.min(100, Math.max(0, (stock / 30) * 100));

  const isCritical = stock <= 0 || (daysRemaining * 24) <= leadTime;
  const isWarning = !isCritical && daysRemaining <= 2;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3 relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400 font-medium">REAL-TIME STOCK DEPLETION METER</span>
        <span
          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
            isCritical
              ? 'bg-rose-950 text-rose-400 border border-rose-800'
              : isWarning
              ? 'bg-amber-950 text-amber-400 border border-amber-800'
              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
          }`}
        >
          {isCritical ? 'DEPLETED / EXHAUSTED' : isWarning ? 'LOW STOCK WARNING' : 'SUPPLY SUFFICIENT'}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">{supply.medicationName}</h4>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Consumption: {supply.dailyConsumption} unit/day · Lead Time: {supply.deliveryLeadTimeHours}h
          </p>
        </div>
        <div className="text-right">
          <span
            className={`text-3xl font-extrabold font-mono ${
              isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {stock}
          </span>
          <span className="text-xs text-slate-400 font-mono ml-1">tablets left</span>
        </div>
      </div>

      {/* Spring Physics Animated Liquid Bar */}
      <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
        <motion.div
          className={`h-full rounded-full ${
            isCritical
              ? 'bg-gradient-to-r from-rose-600 to-rose-400'
              : isWarning
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${fillPercent}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        />
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-1">
        <span>0 units (Runout)</span>
        <span>Lead Time Deficit Window: {leadTime}h</span>
        <span>30 units (Full Fill)</span>
      </div>
    </div>
  );
}
