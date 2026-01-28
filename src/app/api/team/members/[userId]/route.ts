import { NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/lib/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    // Get the current user from NextAuth session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDb();

    // Get the current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only organization owners can remove members
    if (currentUser.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only organization owners can remove members' },
        { status: 403 }
      );
    }

    // Prevent removing self
    if (currentUser._id.toString() === userId) {
      return NextResponse.json(
        { error: 'You cannot remove yourself' },
        { status: 400 }
      );
    }

    // Find the user to be removed
    const userToRemove = await User.findById(userId);
    if (!userToRemove) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify the user is in the same organization
    if (userToRemove.organizationId?.toString() !== currentUser.organizationId?.toString()) {
      return NextResponse.json(
        { error: 'User is not in your organization' },
        { status: 403 }
      );
    }

    // Remove the user from the organization
    await User.findByIdAndUpdate(userId, {
      $unset: { organizationId: 1, role: 1 }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}
