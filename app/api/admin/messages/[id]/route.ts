import { NextRequest, NextResponse } from "next/server";
import { curatorAuthed } from "@/lib/auth";
import { updateMessage } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { updateMessageInSupabase } from "@/lib/supabase-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const isAuthed = await curatorAuthed();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const patch = {
      isPinned: typeof body.isPinned === "boolean" ? body.isPinned : undefined,
      isApproved:
        typeof body.isApproved === "boolean" ? body.isApproved : undefined,
    };

    if (isSupabaseConfigured()) {
      try {
        const supaUpdated = await updateMessageInSupabase(id, patch);
        if (supaUpdated) {
          updateMessage(id, patch); // Also sync memory
          return NextResponse.json({ message: supaUpdated });
        }
      } catch {
        // Fallback
      }
    }

    const updated = updateMessage(id, patch);
    if (!updated) {
      return NextResponse.json(
        { error: "Blessing card not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update message." },
      { status: 400 },
    );
  }
}
