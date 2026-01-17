import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Entry from "@/lib/entryModel";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
  await connectDb();
  const user = getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const entry = await Entry.findOne({ _id: id, userId: user.userId });
    if (!entry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }
    return NextResponse.json(entry);
  }

  const entries = await Entry.find({ userId: user.userId }).sort({ createdAt: -1 });
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  await connectDb();
  const user = getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { name, username, password, url, notes, status, risk } = body;

  if (!name || !username || !password) {
    return NextResponse.json(
      { message: "name, username, password required" },
      { status: 400 }
    );
  }

  const entry = await Entry.create({
    userId: user.userId,
    name,
    username,
    password,
    url,
    notes,
    status,
    risk,
  });
  return NextResponse.json(entry, { status: 201 });
}

export async function PUT(request: Request) {
  await connectDb();
  const user = getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }

  const updates = await request.json();
  const entry = await Entry.findOneAndUpdate(
    { _id: id, userId: user.userId },
    updates,
    { new: true }
  );
  if (!entry) {
    return NextResponse.json({ message: "Entry not found" }, { status: 404 });
  }
  return NextResponse.json(entry);
}

export async function DELETE(request: Request) {
  await connectDb();
  const user = getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }

  const entry = await Entry.findOneAndDelete({ _id: id, userId: user.userId });
  if (!entry) {
    return NextResponse.json({ message: "Entry not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Entry deleted" });
}
