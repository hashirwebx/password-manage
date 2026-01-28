import nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

type SendInvitationEmailParams = {
  to: string;
  inviterName: string;
  organizationId: string;
  token: string;
};

export async function sendInvitationEmail({
  to,
  inviterName,
  organizationId,
  token,
}: SendInvitationEmailParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const acceptUrl = `${appUrl}/invite/${token}`;

  const mailOptions = {
    from: `"Password Manager" <${process.env.EMAIL_FROM || 'noreply@example.com'}>`,
    to,
    subject: `You've been invited to join a team on Password Manager`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You've been invited to join a team</h2>
        <p>${inviterName} has invited you to join their team on Password Manager.</p>
        <p>Click the button below to accept the invitation:</p>
        <p style="margin: 30px 0;">
          <a href="${acceptUrl}" 
             style="background-color: #4CAF50; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 4px;
                    font-weight: bold;">
            Accept Invitation
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p><code>${acceptUrl}</code></p>
        <p style="font-size: 12px; color: #666;">
          This invitation link will expire in 7 days. If you don't want to accept the invitation, you can ignore this email.
        </p>
      </div>
    `,
  };

  try {
    // Send email in both development and production
    await transporter.sendMail(mailOptions);
    console.log('=== EMAIL SENT SUCCESSFULLY ===');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Invitation URL:', acceptUrl);
    console.log('================================');
  } catch (error) {
    console.error('=== EMAIL SENDING FAILED ===');
    console.error('Error:', error);
    console.error('To:', mailOptions.to);
    console.error('Invitation URL:', acceptUrl);
    console.error('============================');
    throw error; // Re-throw to let the caller handle it
  }
}
