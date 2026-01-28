"use client";

import { ReactNode } from 'react';

interface HolographicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

export default function HolographicButton({ children, onClick, href, className = '', disabled = false }: HolographicButtonProps) {
  const Component = href ? 'a' : 'button';
  const props = href ? { href } : { onClick, disabled };

  return (
    <Component
      {...props}
      className={`
        relative px-8 py-4 rounded-full font-bold text-slate-900
        bg-gradient-to-r from-emerald-400 to-emerald-500
        transition-all duration-300 transform
        hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]
        active:scale-100
        disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none
        overflow-hidden
        ${className}
      `}
    >
      {/* Scan-line effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
      
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/50 to-emerald-500/50 blur-xl -z-10" />
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </Component>
  );
}
