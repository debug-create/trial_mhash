'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/' },
    { name: 'Patient', href: '/patient' },
    { name: 'Doctor', href: '/doctor' },
    { name: 'Pharmacy', href: '/pharmacy' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/90 backdrop-blur-md text-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 font-bold transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white font-sans group-hover:text-cyan-400 transition-colors">
            VANISHING DOSE
          </span>
        </Link>

        {/* Plain Text Nav Links */}
        <nav className="flex items-center gap-6 sm:gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-xs sm:text-sm font-medium transition-colors ${
                  isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-4 left-0 right-0 h-0.5 bg-cyan-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

