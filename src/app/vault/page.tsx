import AppShell from "@/components/AppShell";
import Link from "next/link";

const entries = [
  {
    id: "github-org",
    name: "GitHub Org",
    username: "engineering@vaultify.io",
    status: "Healthy",
    updated: "2 hours ago",
    risk: "Low",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    username: "revenue@vaultify.io",
    status: "Rotate",
    updated: "3 days ago",
    risk: "Medium",
  },
  {
    id: "aws-root",
    name: "AWS Root",
    username: "security@vaultify.io",
    status: "Locked",
    updated: "1 week ago",
    risk: "High",
  },
];

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

export default function VaultPage() {
  return (
    <AppShell
      title="Team Vault"
      subtitle="Manage saved credentials, rotation status, and sharing access."
      actions={
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40">
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
      <section className="grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Vault entries</h2>
              <p className="text-sm text-zinc-400">Keep track of sensitive accounts.</p>
            </div>
            <div className="flex gap-3">
              <input
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-zinc-500"
                placeholder="Search vault"
              />
              <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80">
                Filters
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 border-b border-white/10 bg-black/40 px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
              <span>Entry</span>
              <span>Username</span>
              <span>Status</span>
              <span>Updated</span>
            </div>
            {entries.map((entry) => (
              <Link
                key={entry.name}
                href={`/vault/${entry.id}`}
                className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 border-b border-white/5 px-4 py-4 text-sm text-white transition hover:bg-white/5 last:border-b-0"
              >
                <div>
                  <p className="font-semibold">{entry.name}</p>
                  <p className={`text-xs ${riskStyles[entry.risk]}`}>
                    Risk: {entry.risk}
                  </p>
                </div>
                <span className="text-zinc-300">{entry.username}</span>
                <span
                  className={`w-fit rounded-full border px-3 py-1 text-xs ${statusStyles[entry.status]}`}
                >
                  {entry.status}
                </span>
                <span className="text-zinc-400">{entry.updated}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span className="uppercase tracking-[0.2em] text-zinc-500">Quick tags</span>
            {[
              "finance",
              "infra",
              "marketing",
              "shared",
              "recent",
            ].map((tag) => (
              <button
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80"
              >
                {tag}
              </button>
            ))}
            <span className="ml-auto rounded-full border border-white/10 px-3 py-1">
              18 results
            </span>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
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
                      <input type="checkbox" className="h-4 w-4 rounded border-white/20" />
                      {status}
                    </label>
                  ))}
                </div>
              </div>
              <button className="w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80">
                Apply filters
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Security checklist</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Quick actions to keep your vault healthy.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li className="flex items-center justify-between">
                <span>Rotate high-risk entries</span>
                <span className="text-rose-300">2</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Invite security admin</span>
                <span className="text-amber-200">Pending</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Enable MFA reminder</span>
                <span className="text-emerald-300">Enabled</span>
              </li>
            </ul>
            <button className="mt-6 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80">
              Review actions
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-emerald-500/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Team access</p>
            <h3 className="mt-3 text-lg font-semibold text-white">Shared with 6 teammates</h3>
            <p className="mt-2 text-sm text-emerald-100/80">
              Control who can view, edit, or rotate credentials.
            </p>
            <button className="mt-6 w-full rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950">
              Manage access
            </button>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
