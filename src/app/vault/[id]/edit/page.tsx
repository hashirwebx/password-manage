import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function EditVaultEntryPage() {
  return (
    <AppShell
      title="Edit Vault Entry"
      subtitle="Update credentials, notes, or sharing details."
      actions={
        <Link
          href="/vault/aws-root"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/40"
        >
          Back to entry
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold">Entry details</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Keep vault information current and consistent.
          </p>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm text-zinc-300">
              Entry name
              <input
                type="text"
                defaultValue="AWS Root"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Username
              <input
                type="text"
                defaultValue="security@vaultify.io"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Password
              <input
                type="password"
                defaultValue="••••••••••••"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              URL
              <input
                type="url"
                defaultValue="https://aws.amazon.com"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-300">
              Notes
              <textarea
                rows={4}
                defaultValue="Use break-glass protocol. Rotate immediately after incident response."
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950">
              Save changes
            </button>
            <button className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/80">
              Cancel
            </button>
          </div>
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
                <select className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white">
                  <option>Every 30 days</option>
                  <option>Every 60 days</option>
                  <option selected>Every 90 days</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-zinc-300">
                Alerts
                <select className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white">
                  <option>Notify 7 days before</option>
                  <option selected>Notify 14 days before</option>
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
            <button className="mt-5 w-full rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-rose-50">
              Archive entry
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
