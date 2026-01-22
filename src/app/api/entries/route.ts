import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Entry from "@/lib/entryModel";
import { getAuthUser } from "@/lib/auth";
import Share from "@/lib/shareModel";

const sortEntriesDesc = (entries: any[]) =>
  entries.sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.updatedAt || a.createdAt || 0).getTime()
  );

export async function GET(request: Request) {
  await connectDb();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const scope = searchParams.get("scope") || "all";

  if (id) {
    const ownedEntry = await Entry.findOne({ _id: id, userId: user.userId }).lean();
    if (ownedEntry) {
      return NextResponse.json({ ...ownedEntry, shared: false });
    }

    const share = await Share.findOne({
      entryId: id,
      toUserId: user.userId,
      status: "active",
    }).lean();

    if (!share) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    const sharedEntry = await Entry.findById(id).lean();
    if (!sharedEntry) {
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...sharedEntry,
      shared: true,
      shareId: share._id.toString(),
      sharedFromEmail: share.fromEmail,
      permissions: share.permissions,
    });
  }

  const results: any[] = [];

  if (scope !== "shared") {
    const ownedEntries = await Entry.find({ userId: user.userId }).lean();
    ownedEntries.forEach((entry) => {
      results.push({ ...entry, shared: false });
    });
  }

  if (scope !== "owned") {
    const shares = await Share.find({
      toUserId: user.userId,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean();

    if (shares.length > 0) {
      const sharedEntryIds = shares.map((share) => share.entryId);
      const sharedEntries = await Entry.find({ _id: { $in: sharedEntryIds } }).lean();
      const entryMap = new Map(
        sharedEntries.map((entry) => [entry._id.toString(), entry])
      );

      shares.forEach((share) => {
        const entry = entryMap.get(share.entryId.toString());
        if (entry) {
          results.push({
            ...entry,
            shared: true,
            shareId: share._id.toString(),
            sharedFromEmail: share.fromEmail,
            permissions: share.permissions,
          });
        }
      });
    }
  }

  return NextResponse.json(sortEntriesDesc(results));
}

export async function POST(request: Request) {
  await connectDb();
  const user = await getAuthUser();
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
  const user = await getAuthUser();
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
  const user = await getAuthUser();
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
