"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { checkPasswordStrength } from "@/lib/passwordStrength";
import DataStreamBackground from "@/components/DataStreamBackground";
import NeonCard from "@/components/NeonCard";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({ level: "", color: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Registration failed");
        }

        setMode("login");
        setMessage("Account created. Please sign in.");
        return;
      }

      const callbackUrl = searchParams.get("callbackUrl") || "/vault";
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
      });

      // NextAuth will handle the redirect automatically
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Immersive Data-Stream Background */}
      <DataStreamBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12">
        <header className="flex items-center justify-between backdrop-blur-sm">
          <Link href="/" className="text-sm text-slate-300 hover:text-emerald-400 transition-all duration-200 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            ← Back to overview
          </Link>
          <Link href="/vault" className="text-sm text-emerald-400 hover:text-emerald-300 transition-all duration-200 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            Go to vault
          </Link>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <NeonCard className="p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-bold">
              {mode === "login" ? "Welcome back" : "Create account"}
            </p>
            <h1 className="mt-4 text-3xl font-black text-white">
              {mode === "login" ? "Sign in to Vaultify" : "Sign up for Vaultify"}
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              Access your encrypted vault with quantum-grade security.
            </p>

            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm text-gray-300">
                Work email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="rounded-lg border border-emerald-500/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  disabled={loading}
                />
              </label>

              <label className="grid gap-2 text-sm text-gray-300">
                Master password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setStrength(checkPasswordStrength(event.target.value));
                  }}
                  placeholder="••••••••"
                  className="rounded-lg border border-emerald-500/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
                  disabled={loading}
                />
              </label>
              <div style={{ color: strength.color }}>Strength: {strength.level}</div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-3 font-bold text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "Signing in..." : mode === "login" ? "Sign in" : "Create account"}
              </button>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20" />
                  Remember this device
                </label>
                <button className="text-emerald-400 hover:text-emerald-300">Forgot password?</button>
              </div>
              {message ? <p className="text-xs text-rose-300">{message}</p> : null}
            </form>
          </NeonCard>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
              <h2 className="text-lg font-semibold">Why Vaultify?</h2>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li>• Encrypted vault in every session</li>
                <li>• Real-time password health checks</li>
                <li>• Share credentials with role-based access</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                {mode === "login" ? "New to Vaultify?" : "Have an account?"}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {mode === "login" ? "Create an account" : "Sign in instead"}
              </h3>
              <p className="mt-2 text-sm text-emerald-100/80">
                {mode === "login"
                  ? "Start with a secure personal vault and invite your team later."
                  : "Access your existing vault and manage entries."}
              </p>
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="mt-5 w-full rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950"
              >
                {mode === "login" ? "Switch to sign up" : "Switch to sign in"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-white" />}>
      <LoginContent />
    </Suspense>
  );
}
