import crypto from "crypto";
import Invitation from "@/lib/invitationModel";

export const INVITATION_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || process.env.APP_BASE_URL || "http://localhost:3000";

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const canManageInvites = (role: string) => role === "owner" || role === "admin";

export const canRemoveMember = (currentRole: string, targetRole: string) => {
  if (currentRole === "owner") {
    return targetRole !== "owner";
  }
  if (currentRole === "admin") {
    return targetRole === "member";
  }
  return false;
};

export const generateInviteToken = () => crypto.randomBytes(24).toString("hex");

export const invitationExpiresAt = () => new Date(Date.now() + INVITATION_EXPIRATION_MS);

export const markExpiredInvitations = async () => {
  await Invitation.updateMany(
    { status: "pending", expiresAt: { $lt: new Date() } },
    { status: "expired" }
  );
};

export const buildInvitationEmailTemplate = ({
  organizationName,
  token,
  inviteeEmail,
  inviterEmail,
}: {
  organizationName: string;
  token: string;
  inviteeEmail: string;
  inviterEmail: string;
}) => {
  const acceptUrl = `${APP_BASE_URL}/invite/${token}?action=accept`;
  const declineUrl = `${APP_BASE_URL}/invite/${token}?action=decline`;

  const subject = `${inviterEmail} invited you to join ${organizationName}`;

  const html = `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;background:#0f172a;padding:32px;color:#f8fafc;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#020617;border-radius:24px;padding:40px;border:1px solid rgba(255,255,255,0.08);">
            <tr>
              <td>
                <p style="text-transform:uppercase;letter-spacing:0.2em;font-size:12px;color:#34d399;margin:0 0 12px 0;">Password Manager</p>
                <h1 style="font-size:28px;margin:0 0 16px 0;color:#f8fafc;">You're invited to ${organizationName}</h1>
                <p style="font-size:15px;line-height:1.6;color:#cbd5f5;margin:0 0 24px 0;">
                  ${inviterEmail} has invited ${inviteeEmail} to collaborate on secure vault entries.
                  Accept to gain access to the team's shared vault, or decline if you weren't expecting this.
                </p>
                <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                  <tr>
                    <td style="padding-right:12px;">
                      <a href="${acceptUrl}" style="background:#34d399;color:#052e16;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:600;font-size:14px;">Accept invite</a>
                    </td>
                    <td>
                      <a href="${declineUrl}" style="color:#94a3b8;text-decoration:none;font-size:14px;">Decline</a>
                    </td>
                  </tr>
                </table>
                <p style="font-size:13px;color:#64748b;margin:0;">
                  This link expires in 7 days. If you believe this was sent in error, feel free to decline.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const text = `You're invited to ${organizationName} by ${inviterEmail}. Accept: ${acceptUrl} | Decline: ${declineUrl}`;

  return { subject, html, text, acceptUrl, declineUrl };
};
