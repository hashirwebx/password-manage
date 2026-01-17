const entries = [
  {
    name: "GitHub Org",
    username: "engineering@vaultify.io",
    status: "Healthy",
    updated: "2 hours ago",
    risk: "Low",
  },
  {
    name: "Salesforce",
    username: "revenue@vaultify.io",
    status: "Rotate",
    updated: "3 days ago",
    risk: "Medium",
  },
  {
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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Vault</p>
            <h1 className="text-3xl font-semibold">Team Vault</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Manage saved credentials, rotation status, and sharing access.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40">
              Import
            </button>
            <button className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400">
              Add entry
            </button>
          </div>
        </header>

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
                <div
                  key={entry.name}
                  className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 border-b border-white/5 px-4 py-4 text-sm text-white last:border-b-0"
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
                </div>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
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
      </div>
    </div>
  );
}
