import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/db";
import User from "@/lib/userModel";
import Organization from "@/lib/organizationModel";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    console.log('[Register] Starting registration...');
    await connectDb();
    console.log('[Register] DB Connected');

    const { email, password, name } = await request.json();
    console.log(`[Register] Request received for: ${email}`);

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      console.log('[Register] Email already exists');
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    console.log('[Register] Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('[Register] Creating user...');
    const user = await User.create({ 
      email: normalizedEmail, 
      passwordHash,
      name: name?.trim() || normalizedEmail.split('@')[0]
    });
    console.log(`[Register] User created with ID: ${user._id}`);

    console.log('[Register] Creating organization...');
    const organization = await Organization.create({
      name: `${normalizedEmail.split("@")[0] || "Team"}'s Workspace`,
      ownerId: user._id,
    });
    console.log(`[Register] Organization created with ID: ${organization._id}`);

    user.organizationId = organization._id;
    user.role = "owner";
    await user.save();

    const token = signToken({ userId: user._id.toString(), email: user.email });

    const response = NextResponse.json({
      email: user.email,
      organizationId: organization._id.toString(),
      role: user.role,
    });

    response.cookies.set("pm_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log('[Register] Registration successful');
    return response;
  } catch (error: any) {
    console.error('[Register] Error:', error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}