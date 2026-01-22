import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Entry from "@/lib/entryModel";
import Share from "@/lib/shareModel";
import User from "@/lib/userModel";

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export async function GET(request: Request) {
  await connectDb();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get("entryId");

  if (entryId) {
    const entry = await Entry.findOne({ _id: entryId, userId: user.userId });
    if (!entry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    const shares = await Share.find({
      entryId,
      fromUserId: user.userId,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(shares);
  }

  const shares = await Share.find({
    fromUserId: user.userId,
    status: "active",
  })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(shares);
}

export async function POST(request: Request) {
  await connectDb();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { entryId, email } = await request.json();
  if (!entryId || !email) {
    return NextResponse.json({ message: "entryId and email are required" }, { status: 400 });
  }

  const normalizedEmail = normalizeEmail(email);

  const entry = await Entry.findOne({ _id: entryId, userId: user.userId });
  if (!entry) {
    return NextResponse.json({ message: "Entry not found" }, { status: 404 });
  }

  const targetUser = await User.findOne({ email: normalizedEmail });
  if (!targetUser) {
    return NextResponse.json({ message: "Recipient must be a registered user" }, { status: 404 });
  }

  if (targetUser._id.toString() === user.userId) {
    return NextResponse.json({ message: "You cannot share an entry with yourself" }, { status: 400 });
  }

  const share = await Share.findOneAndUpdate(
    {
      entryId,
      toUserId: targetUser._id.toString(),
    },
    {
      entryId,
      fromUserId: user.userId,
      fromEmail: user.email,
      toUserId: targetUser._id.toString(),
      toEmail: targetUser.email,
      permissions: "read",
      status: "active",
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json(share, { status: 201 });
}

export async function DELETE(request: Request) {
  await connectDb();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get("id");

  if (!shareId) {
    return NextResponse.json({ message: "Share id is required" }, { status: 400 });
  }

  const share = await Share.findOneAndUpdate(
    { _id: shareId, fromUserId: user.userId },
    { status: "revoked" },
    { new: true }
  );

  if (!share) {
    return NextResponse.json({ message: "Share not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Share revoked" });
}
