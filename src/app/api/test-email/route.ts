import { NextResponse } from 'next/server';
import { sendInvitationEmail } from '@/lib/email';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'test@example.com';

    // Send a test invitation email
    await sendInvitationEmail({
      to: email,
      inviterName: 'Test Admin',
      organizationId: 'test-org-123',
      token: 'test-token-' + Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`,
      note: 'Check your Mailtrap inbox or console logs'
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: error.message
      },
      { status: 500 }
    );
  }
}
