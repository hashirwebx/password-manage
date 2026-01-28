"use client";

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function GlassCard({ children, className = '', glow = true }: GlassCardProps) {
  return (
    <div 
      className={`
        relative backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20
        transition-all duration-300 hover:bg-white/15
        ${glow ? 'shadow-2xl shadow-cyan-500/10' : ''}
        ${className}
      `}
    >
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 -z-10" />
      )}
      {children}
    </div>
  );
}
