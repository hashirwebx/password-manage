import { NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/lib/userModel';
import Invitation from '@/lib/invitationModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { v4 as uuidv4 } from 'uuid';
import { sendInvitationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();
    
    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Get current user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDb();

    // Get current user with organization info
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || !currentUser.organizationId) {
      return NextResponse.json(
        { error: 'You must be part of an organization to invite members' },
        { status: 403 }
      );
    }

    // Check if user already exists in the organization
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      organizationId: currentUser.organizationId
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User is already a member of your organization' },
        { status: 400 }
      );
    }

    // Check for existing pending invitation
    const existingInvitation = await Invitation.findOne({
      organizationId: currentUser.organizationId,
      email: email.toLowerCase(),
      status: 'pending'
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An invitation is already pending for this email' },
        { status: 400 }
      );
    }

    // Create invitation token
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create invitation
    const invitation = new Invitation({
      organizationId: currentUser.organizationId,
      email: email.toLowerCase(),
      role,
      token,
      invitedBy: currentUser._id,
      invitedByEmail: currentUser.email,
      expiresAt,
      status: 'pending'
    });

    await invitation.save();

    // Send invitation email
    await sendInvitationEmail({
      to: email,
      inviterName: currentUser.email,
      organizationId: currentUser.organizationId.toString(),
      token,
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Get current user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDb();

    // Get current user with organization info
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.organizationId?.toString() !== organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get all pending invitations for the organization
    const invitations = await Invitation.find({
      organizationId,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}
