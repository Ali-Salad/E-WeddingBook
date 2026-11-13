import { NextResponse } from "next/server";
import { getEvent } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchEventFromSupabase } from "@/lib/supabase-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (isSupabaseConfigured()) {
    try {
      const supaEvent = await fetchEventFromSupabase(slug);
      if (supaEvent) {
        return NextResponse.json(supaEvent);
      }
    } catch {
      // Fallback
    }
  }

  const event = getEvent(slug);
  if (!event) {
    return NextResponse.json(
      { error: "Event celebration not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(event);
}
