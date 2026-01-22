"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import { generatePassword } from "@/lib/password";

type Entry = {
  _id: string;
  name: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  status?: string;
  risk?: string;
  updatedAt?: string;
  shared?: boolean;
  shareId?: string;
  sharedFromEmail?: string;
  permissions?: string;
};

type Share = {
  _id: string;
  toEmail: string;
  permissions: string;
  status: string;
  createdAt: string;
};

const statusStyles: Record<string, string> = {
  Healthy: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  Rotate: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  Locked: "border-rose-500/20 bg-rose-500/10 text-rose-300",
};

export default function VaultEntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shares, setShares] = useState<Share[]>([]);
  const [shareEmail, setShareEmail] = useState("");
  const [shareError, setShareError] = useState("");
  const [shareLoading, setShareLoading] = useState(false);

  const loadEntry = async () => {
    try {
      const response = await fetch(`/api/entries?id=${id}`);
      const data = await response.json();
      setEntry(data);
    } catch {
      setMessage("Failed to load entry.");
    }
  };

  const loadShares = async () => {
    if (!id || entry?.shared) {
      return;
    }
    try {
      const response = await fetch(`/api/shares?entryId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setShares(data);
      }
    } catch {
      // ignore share load errors silently
    }
  };

  useEffect(() => {
    if (id) {
      loadEntry();
    }
  }, [id]);

  useEffect(() => {
    if (entry && !entry.shared) {
      loadShares();
    }
  }, [entry]);

  const copyPassword = async () => {
    if (!entry?.password) {
      return;
    }
    await navigator.clipboard.writeText(entry.password);
    setMessage("Password copied.");
  };

  const copyValue = async (label: string, value?: string) => {
    if (!value) {
      return;
    }
    await navigator.clipboard.writeText(value);
    setMessage(`${label} copied.`);
  };

  const rotatePassword = async () => {
    if (!entry || entry.shared) {
      return;
    }
    const newPassword = generatePassword(20);
    await fetch(`/api/entries?id=${entry._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword, status: "Rotate" }),
    });
    setMessage("Password rotated.");
    loadEntry();
  };

  const duplicateEntry = async () => {
    if (!entry || entry.shared) {
      return;
    }
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${entry.name} Copy`,
        username: entry.username,
        password: entry.password,
        url: entry.url,
        notes: entry.notes,
        status: entry.status,
        risk: entry.risk,
      }),
    });
    setMessage("Entry duplicated.");
  };

  const submitShare = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !shareEmail.trim()) {
      setShareError("Please provide an email.");
      return;
    }
    setShareLoading(true);
    setShareError("");
    try {
      const response = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: id, email: shareEmail }),
      });
      const result = await response.json();
      if (!response.ok) {
        setShareError(result.message || "Failed to share entry.");
        return;
      }
      setShareEmail("");
      await loadShares();
      setMessage("Entry shared successfully.");
    } catch {
      setShareError("Failed to share entry.");
    } finally {
      setShareLoading(false);
    }
  };

  const revokeShare = async (shareId: string) => {
    try {
      const response = await fetch(`/api/shares?id=${shareId}`, { method: "DELETE" });
      if (!response.ok) {
        setShareError("Failed to revoke share.");
        return;
      }
      await loadShares();
      setMessage("Share revoked.");
    } catch {
      setShareError("Failed to revoke share.");
    }
  };

  const isSharedEntry = Boolean(entry?.shared);

  return (
    <AppShell
      title={entry?.name || "Entry"}
      subtitle={
        entry
          ? `${entry.username} · ${entry.risk || "Low"} risk${
              entry.shared && entry.sharedFromEmail ? ` · Shared from ${entry.sharedFromEmail}` : ""
            }`
          : ""
      }
      actions={
        <div className="flex flex-wrap gap-3">
          <Link
            href="/vault"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40"
          >
            Back to vault
          </Link>
          {!isSharedEntry ? (
            <button
              onClick={duplicateEntry}
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              Duplicate entry
            </button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-6">
        <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Entry overview</p>
              <h2 className="mt-2 text-2xl font-semibold">{entry?.name || "Loading..."}</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Last updated {entry?.updatedAt ? new Date(entry.updatedAt).toLocaleDateString() : "-"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs ${
                  statusStyles[entry?.status || "Healthy"]
                }`}
              >
                {entry?.status || "Healthy"}
              </span>
              {entry?.shared ? (
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
                  Shared
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Username</p>
                <button
                  onClick={() => copyValue("Username", entry?.username)}
                  className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/80"
                  aria-label="Copy username"
                >
                  📋
                </button>
              </div>
              <p className="mt-2 text-sm text-white">{entry?.username || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">URL</p>
                <button
                  onClick={() => copyValue("URL", entry?.url)}
                  className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/80"
                  aria-label="Copy URL"
                >
                  📋
                </button>
              </div>
              <p className="mt-2 text-sm text-white break-all">{entry?.url || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Password</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/80"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                  <button
                    onClick={copyPassword}
                    className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/80"
                    aria-label="Copy password"
                  >
                    📋
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-white">
                {entry?.password ? (showPassword ? entry.password : "••••••••") : "-"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Notes</p>
              <button
                onClick={() => copyValue("Notes", entry?.notes)}
                className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/80"
                aria-label="Copy notes"
              >
                📋
              </button>
            </div>
            <p className="mt-2 text-sm text-zinc-300">{entry?.notes || "-"}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={copyPassword}
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950"
            >
              Copy password
            </button>
            {!isSharedEntry ? (
              <>
                <button
                  onClick={rotatePassword}
                  className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/80"
                >
                  Rotate now
                </button>
                <Link
                  href={`/vault/${id}/edit`}
                  className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/80"
                >
                  Edit entry
                </Link>
              </>
            ) : (
              <p className="text-sm text-amber-200">Shared entries are read-only.</p>
            )}
          </div>
          {message ? <p className="mt-3 text-sm text-zinc-400">{message}</p> : null}
        </section>

        {!isSharedEntry ? (
          <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Sharing</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Share with teammates</h3>
              </div>
            </div>
            <form onSubmit={submitShare} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={shareEmail}
                onChange={(event) => setShareEmail(event.target.value)}
                placeholder="teammate@example.com"
                className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-zinc-500"
                required
              />
              <button
                type="submit"
                disabled={shareLoading}
                className="rounded-2xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {shareLoading ? "Sharing..." : "Share entry"}
              </button>
            </form>
            {shareError ? <p className="mt-2 text-sm text-rose-400">{shareError}</p> : null}

            <div className="mt-6 space-y-3">
              {shares.length === 0 ? (
                <p className="text-sm text-zinc-500">No active shares yet.</p>
              ) : (
                shares.map((share) => (
                  <div
                    key={share._id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
                  >
                    <div>
                      <p className="font-semibold">{share.toEmail}</p>
                      <p className="text-xs text-zinc-400">
                        {share.permissions.toUpperCase()} · Shared{" "}
                        {new Date(share.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => revokeShare(share._id)}
                      className="rounded-full border border-white/10 px-4 py-1 text-xs text-white/80"
                    >
                      Revoke
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
