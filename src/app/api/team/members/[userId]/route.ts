import { NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/lib/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    console.log('[RemoveMember] Attempting to remove user:', userId);
    
    // Get the current user from NextAuth session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('[RemoveMember] Not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('[RemoveMember] Current user email:', session.user.email);
    await connectDb();

    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      console.log('[RemoveMember] Current user not found in DB');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('[RemoveMember] Current user role:', currentUser.role);
    console.log('[RemoveMember] Current user org:', currentUser.organizationId);

    // Only organization owners can remove members
    if (currentUser.role !== 'owner') {
      console.log('[RemoveMember] User is not owner, role:', currentUser.role);
      return NextResponse.json(
        { error: 'Only organization owners can remove members' },
        { status: 403 }
      );
    }

    // Prevent removing self
    if (currentUser._id.toString() === userId) {
      console.log('[RemoveMember] Attempting to remove self');
      return NextResponse.json(
        { error: 'You cannot remove yourself' },
        { status: 400 }
      );
    }

    // Find the user to be removed
    const userToRemove = await User.findById(userId);
    if (!userToRemove) {
      console.log('[RemoveMember] User to remove not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('[RemoveMember] User to remove:', userToRemove.email);
    console.log('[RemoveMember] User to remove org:', userToRemove.organizationId);

    // Verify the user is in the same organization
    if (userToRemove.organizationId?.toString() !== currentUser.organizationId?.toString()) {
      console.log('[RemoveMember] Users not in same organization');
      return NextResponse.json(
        { error: 'User is not in your organization' },
        { status: 403 }
      );
    }

    console.log('[RemoveMember] Removing user from organization...');
    // Remove the user from the organization
    await User.findByIdAndUpdate(userId, {
      $unset: { organizationId: 1, role: 1 }
    });

    console.log('[RemoveMember] Successfully removed user');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RemoveMember] Error removing team member:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}
