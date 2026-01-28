"use client";

import { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  electric?: boolean;
}

export default function NeonCard({ children, className = '', electric = true }: NeonCardProps) {
  return (
    <div 
      className={`
        relative backdrop-blur-md bg-slate-900/40 rounded-2xl p-8
        transition-all duration-300 hover:bg-slate-900/60
        ${electric ? 'border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border border-white/10'}
        ${className}
      `}
    >
      {electric && (
        <>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-400/10 to-emerald-500/10 -z-10" />
          <div className="absolute inset-0 rounded-2xl border border-emerald-400/20 -z-10" />
        </>
      )}
      {children}
    </div>
  );
}
