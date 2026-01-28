import { NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/lib/userModel';
import Invitation from '@/lib/invitationModel';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  request: Request,
  props: { params: Promise<{ token: string }> }
) {
  try {
    const params = await props.params;
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid invitation link' },
        { status: 400 }
      );
    }

    await connectDb();

    // Find the invitation
    const invitation = await Invitation.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 400 }
      );
    }

    // Get inviter details
    const inviter = await User.findById(invitation.invitedBy);

    return NextResponse.json({
      email: invitation.email,
      role: invitation.role,
      organizationId: invitation.organizationId,
      invitedBy: inviter?.email || invitation.invitedByEmail,
      expiresAt: invitation.expiresAt
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
        { error: 'You must be part of an organization to revoke invitations' },
        { status: 403 }
      );
    }

    // Find and delete the invitation
    const result = await Invitation.findOneAndDelete({
      token,
      organizationId: currentUser.organizationId
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Invitation not found or already revoked' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking invitation:', error);
    return NextResponse.json(
      { error: 'Failed to revoke invitation' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  props: { params: Promise<{ token: string }> }
) {
  try {
    const params = await props.params;
    const { token } = params;
    const { accept } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid invitation link' },
        { status: 400 }
      );
    }

    await connectDb();

    // Find and validate the invitation
    const invitation = await Invitation.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 400 }
      );
    }

    // If declining the invitation
    if (accept === false) {
      invitation.status = 'declined';
      await invitation.save();

      return NextResponse.json({
        success: true,
        message: 'Invitation declined'
      });
    }

    // Get the user accepting the invitation
    const user = await User.findOne({ email: invitation.email });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Please create an account with this email address first',
          code: 'USER_NOT_FOUND',
          email: invitation.email
        },
        { status: 400 }
      );
    }

    // Check if user is already in an organization
    if (user.organizationId) {
      // Check if it's the same organization
      if (user.organizationId.toString() === invitation.organizationId.toString()) {
        return NextResponse.json(
          { 
            error: 'You are already a member of this organization',
            code: 'ALREADY_MEMBER'
          },
          { status: 400 }
        );
      }
      
      // Allow switching to new organization
      const oldOrgId = user.organizationId;
      user.organizationId = invitation.organizationId;
      user.role = invitation.role;
      await user.save();
      
      // Update invitation status
      invitation.status = 'accepted';
      await invitation.save();
      
      return NextResponse.json({
        success: true,
        message: 'Successfully switched to the new organization',
        switched: true,
        oldOrganizationId: oldOrgId.toString()
      });
    }

    // Update user's organization and role
    user.organizationId = invitation.organizationId;
    user.role = invitation.role;
    await user.save();

    // Update invitation status
    invitation.status = 'accepted';
    await invitation.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the organization'
    });
  } catch (error) {
    console.error('Error processing invitation:', error);
    return NextResponse.json(
      { error: 'Failed to process invitation' },
      { status: 500 }
    );
  }
}
