import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDb from "@/lib/db";
import User from "@/lib/userModel";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDb();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    email: user.email,
    userId: user._id.toString(),
    organizationId: user.organizationId?.toString() ?? null,
    role: user.role,
    name: user.name,
  });
}