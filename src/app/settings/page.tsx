import AppShell from "@/components/AppShell";

const alerts = [
  { label: "Password reuse detected", status: "Monitor", color: "text-amber-300" },
  { label: "MFA coverage", status: "92%", color: "text-emerald-300" },
  { label: "Expired credentials", status: "4", color: "text-rose-300" },
];

export default function SettingsPage() {
  return (
    <AppShell
      title="Security Settings"
      subtitle="Control alerts, team policies, and encryption preferences."
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold">Policy controls</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Configure how your team handles sensitive access.
          </p>

          <div className="mt-6 grid gap-4">
            {[
              {
                title: "Require MFA for vault access",
                description: "Block vault entries unless MFA is enabled.",
              },
              {
                title: "Enforce rotation every 90 days",
                description: "Automatically flag entries past rotation date.",
              },
              {
                title: "Notify on shared access changes",
                description: "Send alerts whenever shares are updated.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-zinc-400">{item.description}</p>
                </div>
                <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80">
                  Enabled
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Account</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Basic profile and device info.
            </p>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div className="flex items-center justify-between">
                <span>Primary email</span>
                <span className="text-zinc-400">admin@vaultify.io</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active devices</span>
                <span className="text-zinc-400">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last sign-in</span>
                <span className="text-zinc-400">Today</span>
              </div>
            </div>
            <button className="mt-5 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80">
              Manage account
            </button>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Team</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Keep track of shared access.
            </p>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              {["Aisha", "Hammad", "Sara"].map((member) => (
                <div
                  key={member}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                >
                  <span>{member}</span>
                  <span className="text-xs text-zinc-400">Active</span>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80">
              Invite member
            </button>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Control where security alerts are delivered.
            </p>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              {[
                "Email alerts",
                "Slack digest",
                "Weekly health summary",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                >
                  <span>{item}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/20" />
                </label>
              ))}
            </div>
            <button className="mt-5 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80">
              Save notification prefs
            </button>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Security alerts</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Monitor weak passwords and unusual access.
            </p>
            <div className="mt-4 space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                >
                  <p className="text-sm text-white">{alert.label}</p>
                  <span className={`text-xs font-semibold ${alert.color}`}>{alert.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
              Encryption status
            </p>
            <h3 className="mt-3 text-lg font-semibold text-white">Vault encryption active</h3>
            <p className="mt-2 text-sm text-emerald-100/80">
              Keys are generated locally and never stored in plaintext.
            </p>
            <button className="mt-5 w-full rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950">
              View encryption logs
            </button>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
