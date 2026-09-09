'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Stethoscope, Store, Layers, Activity } from 'lucide-react';
import { useVanishingDose } from '@/context/VanishingDoseContext';

export function Navigation() {
  const pathname = usePathname();
  const { patients } = useVanishingDose();

  const redCount = patients.filter((p) => p.riskStatus === 'RED').length;
  const orangeCount = patients.filter((p) => p.riskStatus === 'ORANGE').length;

  const navItems = [
    {
      name: 'Architecture Pitch',
      href: '/',
      icon: Layers,
      badge: null,
    },
    {
      name: 'Patient App',
      href: '/patient',
      icon: User,
      badge: 'Active Patient',
    },
    {
      name: 'Doctor Command Center',
      href: '/doctor',
      icon: Stethoscope,
      badge: `${redCount} Critical`,
      badgeColor: redCount > 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800',
    },
    {
      name: 'Pharmacy Portal',
      href: '/pharmacy',
      icon: Store,
      badge: 'Live Network',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl text-slate-100 shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                VANISHING DOSE
              </span>
              <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 font-mono text-[10px] text-cyan-400 border border-cyan-800">
                CLOSED-LOOP RECOVERY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Detect → Explain → Resolve → Verify</p>
          </div>
        </Link>

        {/* Portal Links with Framer Motion layoutId Morphing Active Indicator */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-slate-900 border border-slate-700/80 rounded-xl shadow-md"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold font-mono ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
