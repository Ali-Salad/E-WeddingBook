import { NextRequest, NextResponse } from "next/server";
import { curatorAuthed } from "@/lib/auth";
import { setWallActive } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { toggleEventActiveInSupabase } from "@/lib/supabase-store";
import { WEDDING } from "@/lib/guestbook";

export async function PATCH(request: NextRequest) {
  const isAuthed = await curatorAuthed();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive boolean parameter required." },
        { status: 400 },
      );
    }

    if (isSupabaseConfigured()) {
      try {
        await toggleEventActiveInSupabase(WEDDING.slug, body.isActive);
      } catch {
        // Fallback
      }
    }

    const isActive = setWallActive(body.isActive);
    return NextResponse.json({ isActive });
  } catch {
    return NextResponse.json(
      { error: "Failed to update wall status." },
      { status: 400 },
    );
  }
}
