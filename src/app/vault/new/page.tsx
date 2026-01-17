"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { generatePassword } from "@/lib/password";

export default function NewVaultEntryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saveEntry = async (stayOnPage: boolean) => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, url, notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      if (stayOnPage) {
        setName("");
        setUsername("");
        setPassword("");
        setUrl("");
        setNotes("");
        setMessage("Entry saved.");
      } else {
        router.push("/vault");
      }
    } catch {
      setMessage("Failed to save entry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell
      title="Create Vault Entry"
      subtitle="Add a new credential to your team vault."
      actions={
        <Link
          href="/vault"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40"
        >
          Back to vault
        </Link>
      }
    >
      <div className="relative min-h-[70vh]">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Vault snapshot</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Entries will appear here after you save.
              </p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
              Preview mode
            </span>
          </div>
          <div className="mt-6 grid gap-3">
            {[
              "Stripe Admin",
              "AWS Root",
              "Notion Workspace",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300"
              >
                <span>{item}</span>
                <span className="text-xs text-zinc-500">Locked</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 rounded-3xl bg-black/70 backdrop-blur-sm" />

        <div className="relative z-10 -mt-[28rem] flex justify-center px-2 pb-6 lg:-mt-[30rem]">
          <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                  New entry
                </p>
                <h2 className="mt-2 text-xl font-semibold">Create a vault item</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Keep labels clear so your team can find credentials quickly.
                </p>
              </div>
              <Link
                href="/vault"
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70"
              >
                Close
              </Link>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveEntry(false);
                }}
              >
                <label className="grid gap-2 text-sm text-zinc-300">
                  Entry name
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Stripe Admin"
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                  />
                </label>
                <label className="grid gap-2 text-sm text-zinc-300">
                  Username
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="billing@vaultify.io"
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                  />
                </label>
                <label className="grid gap-2 text-sm text-zinc-300">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                  />
                </label>
                <label className="grid gap-2 text-sm text-zinc-300">
                  URL
                  <input
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="https://example.com/login"
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                  />
                </label>
                <label className="grid gap-2 text-sm text-zinc-300">
                  Notes
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Add rotation tips or recovery info."
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
                  />
                </label>

                <div className="mt-2 flex flex-wrap gap-3">
                  <button
                    disabled={saving}
                    className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Save entry
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveEntry(true)}
                    className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Save & add another
                  </button>
                </div>
                {message ? <p className="text-sm text-zinc-400">{message}</p> : null}
              </form>

              <aside className="flex flex-col gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <h3 className="text-sm font-semibold">Sharing</h3>
                  <p className="mt-2 text-xs text-zinc-400">
                    Choose who can view or edit this entry.
                  </p>
                  <div className="mt-3 space-y-2 text-xs text-zinc-300">
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                      <span>Security team</span>
                      <span className="text-emerald-300">Edit</span>
                    </label>
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                      <span>Finance</span>
                      <span className="text-zinc-400">View</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMessage("Access updated.")}
                    className="mt-4 w-full rounded-xl border border-white/10 px-3 py-2 text-xs text-white/80"
                  >
                    Update access
                  </button>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                    Password health
                  </p>
                  <h3 className="mt-3 text-sm font-semibold text-white">Strong by default</h3>
                  <p className="mt-2 text-xs text-emerald-100/80">
                    The generator suggests a 32-character password on save.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPassword(generatePassword(20))}
                    className="mt-4 w-full rounded-xl bg-emerald-400 px-3 py-2 text-xs font-semibold text-emerald-950"
                  >
                    Generate password
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
