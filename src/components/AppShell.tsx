"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-sm font-semibold text-emerald-200"
            >
              PM
            </Link>
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {!loadingUser && !userEmail ? (
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40"
              >
                Sign in
              </Link>
            ) : null}
            {!loadingUser && userEmail ? (
              <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80">
                <span className="max-w-[180px] truncate text-white">{userEmail}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-wide text-emerald-200 hover:text-emerald-100"
                >
                  Sign out
                </button>
              </div>
            ) : null}
            {actions}
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
