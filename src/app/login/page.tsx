"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Auth failed");
      }

      router.push("/vault");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Back to overview
          </Link>
          <Link href="/vault" className="text-sm text-zinc-300 hover:text-white">
            Go to vault
          </Link>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
              {mode === "login" ? "Welcome back" : "Create account"}
            </p>
            <h1 className="mt-4 text-3xl font-semibold">
              {mode === "login" ? "Sign in to Vaultify" : "Sign up for Vaultify"}
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              Access your vault, monitor security alerts, and manage team access.
            </p>

            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm text-zinc-300">
                Work email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-300">
                Master password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                />
              </label>
              <button
                disabled={loading}
                className="mt-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20" />
                  Remember this device
                </label>
                <button className="text-emerald-300 hover:text-emerald-200">Forgot password?</button>
              </div>
              {message ? <p className="text-xs text-rose-300">{message}</p> : null}
            </form>
          </div>

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
