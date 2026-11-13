import { NextRequest, NextResponse } from "next/server";
import { curatorAuthed } from "@/lib/auth";
import { exportMessages } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { exportMessagesFromSupabase } from "@/lib/supabase-store";
import { WEDDING, type PublicMessage } from "@/lib/guestbook";

export async function GET(request: NextRequest) {
  const isAuthed = await curatorAuthed();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const format = request.nextUrl.searchParams.get("format") || "json";
  let messages: PublicMessage[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supaMsgs = await exportMessagesFromSupabase(WEDDING.slug);
      if (supaMsgs && supaMsgs.length > 0) {
        messages = supaMsgs;
      }
    } catch {
      // Fallback
    }
  }

  if (messages.length === 0) {
    messages = exportMessages();
  }

  if (format === "csv") {
    const headers = [
      "ID",
      "Guest Name",
      "Relationship",
      "Blessing Content",
      "Pinned",
      "Created At",
    ];
    const escapeCsv = (str: string) => `"${(str || "").replace(/"/g, '""')}"`;
    const rows = messages.map((m) =>
      [
        escapeCsv(m.id),
        escapeCsv(m.guestName),
        escapeCsv(m.relationship),
        escapeCsv(m.content),
        m.isPinned ? "Yes" : "No",
        escapeCsv(m.createdAt),
      ].join(","),
    );
    const csvContent = [headers.join(","), ...rows].join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="hambalyo-monograph-export.csv"',
      },
    });
  }

  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      count: messages.length,
      messages,
    },
    {
      headers: {
        "Content-Disposition":
          'attachment; filename="hambalyo-monograph-export.json"',
      },
    },
  );
}
