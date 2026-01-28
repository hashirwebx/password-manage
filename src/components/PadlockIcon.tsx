"use client";

export default function PadlockIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg 
        width="80" 
        height="80" 
        viewBox="0 0 80 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Lock body */}
        <rect x="20" y="35" width="40" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
        
        {/* Lock shackle */}
        <path d="M25 35V25C25 15 35 15 40 15C45 15 55 15 55 25V35" fill="none" stroke="currentColor" strokeWidth="2"/>
        
        {/* Keyhole */}
        <circle cx="40" cy="48" r="4" fill="currentColor"/>
        <rect x="38" y="48" width="4" height="8" fill="currentColor"/>
      </svg>
      
      {/* Glowing animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-50 blur-xl animate-pulse" />
      <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-spin" style={{ animationDuration: '8s' }} />
    </div>
  );
}
