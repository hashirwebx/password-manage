import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import Entry from "@/lib/entryModel";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          error: "Invalid format. Expected an array of entries.",
          example: [
            {
              name: "Example Entry",
              username: "user@example.com",
              password: "securepassword",
              url: "https://example.com",
              notes: "Optional notes"
            }
          ]
        },
        { status: 400 }
      );
    }

    const userId = user.userId;
    const importedEntries = [];
    const errors = [];

    for (const item of body) {
      try {
        // Flexible field mapping - try common variations
        const name = item.name || item.title || item.service || item.site || item.account || item.label;
        const username = item.username || item.user || item.email || item.login || item.account || item.userId;
        const password = item.password || item.pass || item.passwd || item.pwd || item.secret;
        const url = item.url || item.website || item.site || item.domain || item.link || "";
        const notes = item.notes || item.comment || item.description || item.remark || "";

        // Validate required fields
        if (!name || !username || !password) {
          errors.push(`Entry missing required fields (name/username/password). Available fields: ${Object.keys(item).join(', ')}`);
          continue;
        }

        const entry = new Entry({
          userId,
          name: String(name),
          username: String(username),
          password: String(password),
          url: String(url),
          notes: String(notes),
        });

        await entry.save();
        importedEntries.push({
          _id: entry._id,
          name: entry.name,
          username: entry.username,
        });
      } catch (error) {
        errors.push(`Failed to import entry: ${JSON.stringify(item)} - ${error}`);
      }
    }

    return NextResponse.json({
      message: `Imported ${importedEntries.length} entries successfully.`,
      imported: importedEntries.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to process import" },
      { status: 500 }
    );
  }
}
