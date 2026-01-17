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

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ message: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
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