"use client";

import { useMemo, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import BackendStatus from "@/components/BackendStatus";
import EntriesPanel from "@/components/EntriesPanel";
import VaultEntriesTable from "@/components/VaultEntriesTable";
import Link from "next/link";

export default function VaultPage() {
  const [search, setSearch] = useState("");
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [resultCount, setResultCount] = useState(0);
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const quickTags = useMemo(
    () => ["finance", "infra", "marketing", "shared", "recent"],
    []
  );

  const toggleFilter = (value: string, list: string[], setList: (next: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
      return;
    }
    setList([...list, value]);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Check file type
    if (file.type !== "application/json" && !file.name.toLowerCase().endsWith('.json')) {
      setImportMessage("Error: Only JSON files are allowed.");
      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const response = await fetch("/api/entries/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = `Import failed: ${result.error}`;
        if (result.example) {
          errorMessage += `\n\nExpected format:\n${JSON.stringify(result.example, null, 2)}`;
        }
        setImportMessage(errorMessage);
        return;
      }

      setImportMessage(result.message);
      // Refresh the entries table
      window.location.reload();
    } catch (error) {
      setImportMessage("Import failed. Please check the file format and try again.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <AppShell
      title="Team Vault"
      subtitle="Manage saved credentials, rotation status, and sharing access."
      actions={
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40"
          >
            Import
          </button>
          <Link
            href="/vault/new"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Add entry
          </Link>
        </div>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />
      <section className="grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
        <div className="flex flex-col gap-6">
          <EntriesPanel />
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Vault entries</h2>
                <p className="text-sm text-zinc-400">Keep track of sensitive accounts.</p>
              </div>
              <div className="flex gap-3">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-zinc-500"
                  placeholder="Search vault"
                />
                <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80">
                  Filters
                </button>
              </div>
            </div>

            <div className="mt-6">
              <VaultEntriesTable
                search={search}
                risks={selectedRisks}
                statuses={selectedStatuses}
                onCountChange={setResultCount}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="uppercase tracking-[0.2em] text-zinc-500">Quick tags</span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80"
                >
                  {tag}
                </button>
              ))}
              <span className="ml-auto rounded-full border border-white/10 px-3 py-1">
                {resultCount} results
              </span>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <BackendStatus />
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Filters</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Narrow results by risk, status, and ownership.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Risk</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { label: "High", style: "border-rose-500/30 text-rose-200" },
                    { label: "Medium", style: "border-amber-500/30 text-amber-200" },
                    { label: "Low", style: "border-emerald-500/30 text-emerald-200" },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => toggleFilter(chip.label, selectedRisks, setSelectedRisks)}
                      className={`rounded-full border px-3 py-1 text-xs ${chip.style}`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Status</p>
                <div className="mt-2 grid gap-2 text-sm text-zinc-300">
                  {[
                    "Healthy",
                    "Rotate",
                    "Locked",
                  ].map((status) => (
                    <label key={status} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => toggleFilter(status, selectedStatuses, setSelectedStatuses)}
                        className="h-4 w-4 rounded border-white/20"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedRisks([]);
                  setSelectedStatuses([]);
                }}
                className="w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80"
              >
                Clear filters
              </button>
              {importMessage ? (
                <p className="text-xs text-zinc-400">{importMessage}</p>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
