"use client";

import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor: string;
}

export default function FeatureCard({ icon, title, description, iconColor }: FeatureCardProps) {
  return (
    <div className="group relative backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
