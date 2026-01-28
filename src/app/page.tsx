import Link from "next/link";
import NeonCard from "@/components/NeonCard";
import PadlockIcon from "@/components/PadlockIcon";
import DataStreamBackground from "@/components/DataStreamBackground";
import HolographicButton from "@/components/HolographicButton";
import { FolderOpen, ShieldCheck, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Immersive Data-Stream Background */}
      <DataStreamBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12">
        {/* Header with Electric Blue Accents */}
        <header className="flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              V
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-400 font-semibold">
                Password Manager
              </p>
              <h1 className="text-xl font-bold text-white">Vaultify</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <span className="text-white font-medium">Overview</span>
            <Link href="/vault" className="transition-all duration-200 hover:text-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              Vault
            </Link>
            <Link href="/settings" className="transition-all duration-200 hover:text-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              Security
            </Link>
            <span className="text-slate-500">Pricing</span>
          </nav>
          <Link
            href="/login"
            className="rounded-full border border-emerald-500/30 px-4 py-2 text-sm text-white/90 backdrop-blur-sm bg-slate-900/40 transition-all duration-200 hover:bg-slate-900/60 hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            Sign in
          </Link>
        </header>

        {/* Hero Section with Neon-Electric UI */}
        <NeonCard className="text-center max-w-4xl mx-auto">
          <div className="flex flex-col gap-8 items-center">
            {/* Advanced Security Visuals */}
            <div className="relative">
              <PadlockIcon className="w-20 h-20 text-emerald-400" />
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">
                Quantum-Grade Encryption
              </p>
              <h2 className="text-5xl md:text-6xl font-black leading-tight text-white tracking-tight">
                Store every credential in one encrypted workspace.
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Military-grade security with real-time data stream protection and advanced threat detection.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
              <HolographicButton href="/vault">
                Open Vault
              </HolographicButton>
              <Link
                href="/vault"
                className="rounded-full border border-emerald-500/30 px-8 py-4 text-sm font-semibold text-emerald-300 backdrop-blur-sm bg-slate-900/40 transition-all duration-200 hover:bg-slate-900/60 hover:border-emerald-400/50 hover:text-emerald-200"
              >
                View Entries
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 justify-center text-xs text-slate-400">
              <span className="rounded-full border border-emerald-500/20 px-4 py-2 backdrop-blur-sm bg-slate-900/30">Zero-Knowledge Architecture</span>
              <span className="rounded-full border border-emerald-500/20 px-4 py-2 backdrop-blur-sm bg-slate-900/30">Real-time Threat Detection</span>
              <span className="rounded-full border border-emerald-500/20 px-4 py-2 backdrop-blur-sm bg-slate-900/30">Quantum Encryption</span>
            </div>
          </div>
        </NeonCard>

        {/* Professional Grid Layout with Tech Icons */}
        <section className="grid gap-8 md:grid-cols-3">
          <NeonCard className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Smart Folders</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Intelligent organization with AI-powered categorization and automated risk assessment.
              </p>
            </div>
          </NeonCard>

          <NeonCard className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                {/* Central Padlock Animation */}
                <div className="absolute -top-2 -right-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Audit-Ready</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Real-time monitoring with advanced security analytics and compliance reporting.
              </p>
            </div>
          </NeonCard>

          <NeonCard className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Secure Share</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                End-to-end encrypted sharing with granular access controls and audit trails.
              </p>
            </div>
          </NeonCard>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-start justify-between gap-4 border-t border-emerald-500/20 pt-6 text-sm text-slate-400 md:flex-row backdrop-blur-sm">
          <p>Vaultify Password Manager — Advanced Security Infrastructure</p>
          <p className="text-emerald-400">Powered by Quantum Encryption</p>
        </footer>
      </div>
    </div>
  );
}
