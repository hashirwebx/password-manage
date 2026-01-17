"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { generatePassword } from "@/lib/password";

type Entry = {
  _id: string;
  name: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
};

export default function EditVaultEntryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [rotation, setRotation] = useState("Every 90 days");
  const [alerts, setAlerts] = useState("Notify 14 days before");

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const response = await fetch(`/api/entries?id=${id}`);
        const data = await response.json();
        setEntry(data);
        setName(data.name || "");
        setUsername(data.username || "");
        setPassword(data.password || "");
        setUrl(data.url || "");
        setNotes(data.notes || "");
      } catch {
        setMessage("Failed to load entry.");
      }
    };

    if (id) {
      loadEntry();
    }
  }, [id]);

  const saveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/entries?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, url, notes }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      setMessage("Changes saved.");
    } catch {
      setMessage("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const archiveEntry = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/entries?id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      router.push("/vault");
    } catch {
      setMessage("Failed to archive entry.");
      setSaving(false);
    }
  };

  return (
    <AppShell
      title="Edit Vault Entry"
      subtitle="Update credentials, notes, or sharing details."
      actions={
        <Link
          href={`/vault/${id}`}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40"
        >
          Back to entry
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6"
          onSubmit={saveChanges}
        >
          <h2 className="text-lg font-semibold">Entry details</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Keep vault information current and consistent.
          </p>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm text-zinc-300">
              Entry name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Username
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
            <button
              type="button"
              onClick={() => setPassword(generatePassword(20))}
              className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs text-white/80"
            >
              Generate password
            </button>
            <label className="grid gap-2 text-sm text-zinc-300">
              URL
              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Notes
              <textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              disabled={saving}
              className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => router.push(`/vault/${id}`)}
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/80"
            >
              Cancel
            </button>
          </div>
          {message ? <p className="mt-3 text-sm text-zinc-400">{message}</p> : null}
        </form>

        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Rotation</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Update rotation policy and reminder cadence.
            </p>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-2 text-sm text-zinc-300">
                Rotation interval
                <select
                  value={rotation}
                  onChange={(event) => setRotation(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                >
                  <option>Every 30 days</option>
                  <option>Every 60 days</option>
                  <option>Every 90 days</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-zinc-300">
                Alerts
                <select
                  value={alerts}
                  onChange={(event) => setAlerts(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                >
                  <option>Notify 7 days before</option>
                  <option>Notify 14 days before</option>
                  <option>Notify 30 days before</option>
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-200">Danger zone</p>
            <h3 className="mt-3 text-lg font-semibold text-white">Archive entry</h3>
            <p className="mt-2 text-sm text-rose-100/80">
              Remove this entry from the active vault list.
            </p>
            <button
              disabled={saving}
              onClick={archiveEntry}
              className="mt-5 w-full rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Archive entry
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
