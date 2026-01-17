import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/db";
import User from "@/lib/userModel";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  await connectDb();
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password required" }, { status: 400 });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });
  const response = NextResponse.json({ email: user.email });
  response.cookies.set("pm_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}