"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Entry = {
  _id: string;
  name: string;
  username: string;
  status?: string;
  risk?: string;
  updatedAt?: string;
};

type VaultEntriesTableProps = {
  search: string;
  risks: string[];
  statuses: string[];
  onCountChange?: (count: number) => void;
};

const statusStyles: Record<string, string> = {
  Healthy: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Rotate: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Locked: "bg-rose-500/10 text-rose-300 border-rose-500/20",
};

const riskStyles: Record<string, string> = {
  Low: "text-emerald-200",
  Medium: "text-amber-200",
  High: "text-rose-200",
};

const formatUpdated = (value?: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return date.toLocaleDateString();
};

export default function VaultEntriesTable({
  search,
  risks,
  statuses,
  onCountChange,
}: VaultEntriesTableProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState("");

  const loadEntries = async () => {
    try {
      const response = await fetch("/api/entries");
      const data = await response.json();
      setEntries(data);
    } catch {
      setError("Failed to load entries");
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesSearch =
        !term ||
        entry.name.toLowerCase().includes(term) ||
        entry.username.toLowerCase().includes(term);
      const matchesRisk = risks.length === 0 || risks.includes(entry.risk || "Low");
      const matchesStatus =
        statuses.length === 0 || statuses.includes(entry.status || "Healthy");
      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [entries, risks, search, statuses]);

  useEffect(() => {
    onCountChange?.(filteredEntries.length);
  }, [filteredEntries.length, onCountChange]);

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Vault entries</h2>
          <p className="text-sm text-zinc-400">Keep track of sensitive accounts.</p>
        </div>
        <button
          onClick={loadEntries}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80"
        >
          Refresh
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 border-b border-white/10 bg-black/40 px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
          <span>Entry</span>
          <span>Username</span>
          <span>Status</span>
          <span>Updated</span>
        </div>
        {filteredEntries.length === 0 ? (
          <div className="px-4 py-6 text-sm text-zinc-500">No entries found.</div>
        ) : (
          filteredEntries.map((entry) => (
            <Link
              key={entry._id}
              href={`/vault/${entry._id}`}
              className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 border-b border-white/5 px-4 py-4 text-sm text-white transition hover:bg-white/5 last:border-b-0"
            >
              <div>
                <p className="font-semibold">{entry.name}</p>
                <p className={`text-xs ${riskStyles[entry.risk || "Low"]}`}>
                  Risk: {entry.risk || "Low"}
                </p>
              </div>
              <span className="text-zinc-300">{entry.username}</span>
              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs ${
                  statusStyles[entry.status || "Healthy"]
                }`}
              >
                {entry.status || "Healthy"}
              </span>
              <span className="text-zinc-400">{formatUpdated(entry.updatedAt)}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
