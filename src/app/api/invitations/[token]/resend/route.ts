import { NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Invitation from '@/lib/invitationModel';
import User from '@/lib/userModel';
import { getAuthUser } from '@/lib/auth';
import { sendInvitationEmail } from '@/lib/email';

export async function POST(
  request: Request,
  props: { params: Promise<{ token: string }> }
) {
  try {
    const params = await props.params;
    const { token } = params;

    // Get current user
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDb();

    // Get current user with organization info
    const currentUser = await User.findOne({ email: authUser.email });
    if (!currentUser || !currentUser.organizationId) {
      return NextResponse.json(
        { error: 'You must be part of an organization to resend invitations' },
        { status: 403 }
      );
    }

    // Find the invitation by token
    const invitation = await Invitation.findOne({ token });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Verify the invitation belongs to the user's organization
    if (invitation.organizationId.toString() !== currentUser.organizationId.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update expiration date (extend by 7 days from now)
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    invitation.expiresAt = newExpiresAt;
    await invitation.save();

    // Resend the invitation email
    await sendInvitationEmail({
      to: invitation.email,
      inviterName: currentUser.email,
      organizationId: currentUser.organizationId.toString(),
      token: invitation.token,
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation resent successfully'
    });
  } catch (error) {
    console.error('Error resending invitation:', error);
    return NextResponse.json(
      { error: 'Failed to resend invitation' },
      { status: 500 }
    );
  }
}
