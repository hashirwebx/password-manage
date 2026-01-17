export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              PM
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                Password Manager
              </p>
              <h1 className="text-xl font-semibold">Vaultify</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <span className="text-white">Overview</span>
            <span>Vault</span>
            <span>Security</span>
            <span>Pricing</span>
          </nav>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/90 transition hover:border-white/40">
            Sign in
          </button>
        </header>

        <section className="grid gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/40 p-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Frontend preview
            </p>
            <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
              Store every credential in one calm, encrypted workspace.
            </h2>
            <p className="text-base text-zinc-300 md:text-lg">
              Organize logins, secure notes, and shared access with a clean vault UI built
              entirely in Next.js. Backend integrations will follow after the UI is approved.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400">
                Create vault
              </button>
              <button className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/40">
                See vault preview
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
              <span className="rounded-full border border-white/10 px-3 py-1">Zero-knowledge UI</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Role-based sharing</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Instant search</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Vault preview</p>
                <h3 className="text-lg font-semibold">Team Vault</h3>
              </div>
              <button className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                Add entry
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { name: "Stripe Admin", user: "billing@vaultify.io", tag: "Finance" },
                { name: "AWS Root", user: "security@vaultify.io", tag: "Infra" },
                { name: "Notion Workspace", user: "ops@vaultify.io", tag: "Ops" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-zinc-400">{item.user}</p>
                  </div>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Smart folders",
              description: "Group credentials by project, team, or risk level in a single click.",
            },
            {
              title: "Audit-ready",
              description: "Track last access, rotation status, and ownership across entries.",
            },
            {
              title: "Secure share",
              description: "Invite teammates without exposing raw passwords or recovery keys.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6"
            >
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-8 md:grid-cols-[1fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Security snapshot</p>
            <h3 className="text-2xl font-semibold">Your vault hygiene at a glance</h3>
            <p className="text-sm text-zinc-400">
              Frontend widgets highlight weak passwords, inactive accounts, and pending
              rotations. Backend scoring will be wired in after UI approval.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              { label: "Weak passwords", value: 3, trend: "-2 this week" },
              { label: "Pending rotations", value: 6, trend: "+1 new" },
              { label: "Shared entries", value: 12, trend: "Stable" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-zinc-300">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.trend}</p>
                </div>
                <span className="text-lg font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 md:flex-row">
          <p>Frontend prototype for the Password Manager app.</p>
          <p>Next.js UI only — backend integration comes next.</p>
        </footer>
      </div>
    </div>
  );
}
