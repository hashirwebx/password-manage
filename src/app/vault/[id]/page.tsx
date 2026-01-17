import Link from "next/link";
import AppShell from "@/components/AppShell";

const access = [
  { name: "Security team", role: "Edit", status: "Active" },
  { name: "Finance", role: "View", status: "Active" },
  { name: "Ops", role: "Rotate", status: "Pending" },
];

export default function VaultEntryDetailPage() {
  return (
    <AppShell
      title="AWS Root"
      subtitle="security@vaultify.io · High risk"
      actions={
        <div className="flex flex-wrap gap-3">
          <Link
            href="/vault"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40"
          >
            Back to vault
          </Link>
          <Link
            href="/vault/new"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Duplicate entry
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Entry overview</p>
              <h2 className="mt-2 text-2xl font-semibold">AWS Root</h2>
              <p className="mt-2 text-sm text-zinc-400">Last rotated 45 days ago</p>
            </div>
            <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs text-rose-300">
              Locked
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { label: "Username", value: "security@vaultify.io" },
              { label: "URL", value: "https://aws.amazon.com" },
              { label: "Vault folder", value: "Infrastructure" },
              { label: "Rotation", value: "Every 90 days" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{item.label}</p>
                <p className="mt-2 text-sm text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Notes</p>
            <p className="mt-2 text-sm text-zinc-300">
              Use break-glass protocol. Rotate immediately after incident response.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950">
              Copy password
            </button>
            <button className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/80">
              Rotate now
            </button>
            <Link
              href="/vault/aws-root/edit"
              className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/80"
            >
              Edit entry
            </Link>
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Shared access</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Manage who can view or edit this entry.
            </p>
            <div className="mt-4 space-y-3">
              {access.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500">{item.role}</p>
                  </div>
                  <span className="text-xs text-emerald-300">{item.status}</span>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80">
              Update sharing
            </button>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
              Risk insights
            </p>
            <h3 className="mt-3 text-lg font-semibold text-white">High risk credential</h3>
            <p className="mt-2 text-sm text-emerald-100/80">
              Detected 3 shared admins and rotation overdue by 15 days.
            </p>
            <button className="mt-5 w-full rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950">
              Review risk plan
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
