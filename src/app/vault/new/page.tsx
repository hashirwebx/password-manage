"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { generatePassword } from "@/lib/password";
import { checkPasswordStrength } from "@/lib/passwordStrength";

export default function NewVaultEntryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState({ level: "", color: "" });

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
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            saveEntry(false);
          }}
        >
          <h2 className="text-lg font-semibold">Entry details</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Keep labels clear so your team can find credentials quickly.
          </p>

          <div className="mt-6 grid gap-4">
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
                onChange={(event) => {
                  setPassword(event.target.value);
                  setStrength(checkPasswordStrength(event.target.value));
                }}
                placeholder="••••••••"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500"
              />
              <div style={{ color: strength.color }}>Strength: {strength.level}</div>
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
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
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
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
              Password tools
            </p>
            <h3 className="mt-3 text-sm font-semibold text-white">Generate strong password</h3>
            <p className="mt-2 text-xs text-emerald-100/80">
              Create a secure password and paste it in the field.
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
    </AppShell>
  );
}
