"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataStreamBackground from "@/components/DataStreamBackground";

const navigation = [
  { label: "Overview", href: "/" },
  { label: "Vault", href: "/vault" },
  { label: "Settings", href: "/settings" },
];

type AppShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function AppShell({ title, subtitle, actions, children }: AppShellProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          if (active) {
            setUserEmail(null);
          }
          return;
        }
        const data = (await response.json()) as { email?: string };
        if (active) {
          setUserEmail(data?.email ?? null);
        }
      } catch {
        if (active) {
          setUserEmail(null);
        }
      } finally {
        if (active) {
          setLoadingUser(false);
        }
      }
    };

    loadUser();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUserEmail(null);
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Immersive Data-Stream Background */}
      <DataStreamBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-wrap items-center justify-between gap-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            >
              V
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-emerald-400 font-semibold">{subtitle}</p> : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-all duration-200 hover:text-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {!loadingUser && !userEmail ? (
              <Link
                href="/login"
                className="rounded-full border border-emerald-500/30 px-4 py-2 text-sm text-white/90 backdrop-blur-sm bg-slate-900/40 transition-all duration-200 hover:bg-slate-900/60 hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Sign in
              </Link>
            ) : null}
            {!loadingUser && userEmail ? (
              <div className="flex items-center gap-3 rounded-full border border-emerald-500/30 px-4 py-2 text-sm text-white/90 backdrop-blur-sm bg-slate-900/40 transition-all duration-200 hover:bg-slate-900/60 hover:border-emerald-400/50">
                <span className="max-w-[180px] truncate text-white">{userEmail}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-wide text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Sign out
                </button>
              </div>
            ) : null}
            {actions}
          </div>
        </header>

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
