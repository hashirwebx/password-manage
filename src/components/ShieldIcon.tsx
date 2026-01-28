"use client";

export default function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={className}
      width="120" 
      height="120" 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M60 10L20 30V60C20 85 40 105 60 110C80 105 100 85 100 60V30L60 10Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      <path 
        d="M45 50L55 60L75 40" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
