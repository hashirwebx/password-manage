"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

const alerts = [
  { label: "Password reuse detected", status: "Monitor", color: "text-amber-300" },
  { label: "MFA coverage", status: "92%", color: "text-emerald-300" },
  { label: "Expired credentials", status: "4", color: "text-rose-300" },
];

type InviteSummary = {
  id: string;
  email: string;
  role: "admin" | "member";
  status: string;
  invitedByEmail: string;
  expiresAt: string;
};

type TeamMember = {
  _id: string;
  email: string;
  role: "owner" | "admin" | "member";
  createdAt: string;
};

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackDigest, setSlackDigest] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [notice, setNotice] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"owner" | "admin" | "member" | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [invitations, setInvitations] = useState<InviteSummary[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "member" });
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pm_settings");
    if (!stored) {
      return;
    }
    const parsed = JSON.parse(stored);
    setEmailAlerts(Boolean(parsed.emailAlerts));
    setSlackDigest(Boolean(parsed.slackDigest));
    setWeeklySummary(Boolean(parsed.weeklySummary));
  }, []);

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          if (active) {
            setUserEmail(null);
          }
          return;
        }
        const data = (await response.json()) as {
          email?: string;
          organizationId?: string | null;
          role?: "owner" | "admin" | "member";
        };
        if (active) {
          setUserEmail(data?.email ?? null);
          setOrganizationId(data?.organizationId ?? null);
          setUserRole(data?.role ?? null);
        }
      } catch {
        if (active) {
          setUserEmail(null);
        }
      } finally {
        if (active) {
          setLoadingUser(false);
        }
      }
    };

    loadUser();
    return () => {
      active = false;
    };
  }, []);

  const canInvite = Boolean(
    organizationId && (userRole === "owner" || userRole === "admin")
  );

  const loadInvitations = async () => {
    if (!canInvite) {
      setInvitations([]);
      return;
    }
    try {
      setLoadingInvites(true);
      const response = await fetch("/api/invitations", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load invitations");
      }
      const data = (await response.json()) as InviteSummary[];
      setInvitations(data);
    } catch {
      setInvitations([]);
    } finally {
      setLoadingInvites(false);
    }
  };

  // Load team members
  const fetchTeamMembers = useCallback(async () => {
    if (!organizationId) return;
    
    setLoadingMembers(true);
    try {
      const response = await fetch(`/api/team/members?organizationId=${organizationId}`);
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.members || []);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoadingMembers(false);
    }
  }, [organizationId]);

  useEffect(() => {
    if (!loadingUser && canInvite) {
      loadInvitations();
      fetchTeamMembers();
    }
  }, [canInvite, loadingUser, fetchTeamMembers]);

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      const response = await fetch(`/api/team/members/${userId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh the members list
        await fetchTeamMembers();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to remove team member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove team member');
    }
  };

  const handleInviteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inviteForm.email.trim()) {
      setInviteMessage("Email is required.");
      return;
    }
    setInviteMessage(null);
    setInviting(true);
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteForm.email,
          role: inviteForm.role,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setInviteMessage(result?.message ?? "Failed to send invitation.");
        return;
      }
      setInviteMessage("Invitation sent successfully.");
      setInviteForm({ email: "", role: "member" });
      await loadInvitations();
    } catch {
      setInviteMessage("Failed to send invitation. Please try again.");
    } finally {
      setInviting(false);
    }
  };

  const savePreferences = () => {
    localStorage.setItem(
      "pm_settings",
      JSON.stringify({ emailAlerts, slackDigest, weeklySummary })
    );
    setNotice("Preferences saved.");
  };

  return (
    <AppShell
      title="Security Settings"
      subtitle="Control alerts, team policies, and encryption preferences."
    >
<section className="space-y-6">
        {/* Team Members Section */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your team members and their access levels.
          </p>

          {loadingMembers ? (
            <div className="mt-4 text-center text-zinc-400">Loading team members...</div>
          ) : teamMembers.length > 0 ? (
            <div className="mt-4 space-y-2">
              {teamMembers.map((member) => (
                <div key={member._id} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <div>
                    <p className="font-medium">{member.email}</p>
                    <p className="text-sm text-zinc-400 capitalize">
                      {member.role}
                      {member._id === userEmail && ' (You)'}
                    </p>
                  </div>
                  {userRole === 'owner' && member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-center text-zinc-500">No team members found.</div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
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
                    <button
                      onClick={() => setNotice(`${item.title} updated.`)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80"
                    >
                      Enabled
                    </button>
                  </div>
                ))}
              </div>
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
                <span className="text-zinc-400">
                  {loadingUser ? "Loading..." : userEmail ?? "Not signed in"}
                </span>
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
            <button
              onClick={() => setNotice("Checklist opened.")}
              className="mt-6 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80"
            >
              Review actions
            </button>
            <button
              onClick={() => setNotice("Account settings opened.")}
              className="mt-3 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80"
            >
              Update profile
            </button>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Team</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Invite teammates and monitor pending access.
            </p>
            {canInvite ? (
              <form onSubmit={handleInviteSubmit} className="mt-4 space-y-3 text-sm text-zinc-300">
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(event) => setInviteForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="teammate@company.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-zinc-500"
                />
                <select
                  value={inviteForm.role}
                  onChange={(event) =>
                    setInviteForm((prev) => ({ ...prev, role: event.target.value as "admin" | "member" }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white"
                >
                  <option value="member">Member access</option>
                  <option value="admin">Admin access</option>
                </select>
                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80 disabled:opacity-50"
                >
                  {inviting ? "Sending..." : "Invite member"}
                </button>
                {inviteMessage ? (
                  <p className="text-xs text-zinc-400">{inviteMessage}</p>
                ) : null}
              </form>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                Only workspace owners or admins can send invitations.
              </p>
            )}
            <div className="mt-6 space-y-3 text-sm text-zinc-300">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500">
                <span>Pending invites</span>
                {loadingInvites ? <span className="text-[10px] text-zinc-500">Loading...</span> : null}
              </div>
              {invitations.length === 0 ? (
                <p className="text-xs text-zinc-500">No pending invitations.</p>
              ) : (
                invitations.map((invite) => (
                  <div
                    key={invite.id}
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-sm text-white">
                      <span>{invite.email}</span>
                      <span className="text-xs text-zinc-400">{invite.role}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      Expires {new Date(invite.expiresAt).toLocaleDateString()} · Invited by {invite.invitedByEmail}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Control where security alerts are delivered.
            </p>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <span>Email alerts</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                  className="h-4 w-4 rounded border-white/20"
                />
              </label>
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <span>Slack digest</span>
                <input
                  type="checkbox"
                  checked={slackDigest}
                  onChange={() => setSlackDigest(!slackDigest)}
                  className="h-4 w-4 rounded border-white/20"
                />
              </label>
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <span>Weekly health summary</span>
                <input
                  type="checkbox"
                  checked={weeklySummary}
                  onChange={() => setWeeklySummary(!weeklySummary)}
                  className="h-4 w-4 rounded border-white/20"
                />
              </label>
            </div>
            <button
              onClick={savePreferences}
              className="mt-5 w-full rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80"
            >
              Save notification prefs
            </button>
            {notice ? <p className="mt-2 text-xs text-zinc-400">{notice}</p> : null}
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
            <button
              onClick={() => setNotice("Encryption logs opened.")}
              className="mt-5 w-full rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950"
            >
              View encryption logs
            </button>
          </div>
        </aside>
      </div>
    </section>
    </AppShell>
  );
}
