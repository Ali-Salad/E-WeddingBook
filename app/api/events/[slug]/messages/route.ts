import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  fetchMessagesFromSupabase,
  insertMessageIntoSupabase,
} from "@/lib/supabase-store";
import { createMessage, listMessages } from "@/lib/store";
import { containsProfanity, sanitizeText } from "@/lib/moderation";
import { charLength, isRelationship } from "@/lib/guestbook";
import type { RelationshipType } from "@/lib/supabase/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  const relationship = searchParams.get("relationship") || undefined;
  const cursor = searchParams.get("cursor") || undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supaResult = await fetchMessagesFromSupabase({
        slug,
        relationship,
        cursor,
        limit,
      });
      if (supaResult) {
        return NextResponse.json(supaResult);
      }
    } catch {
      // Fall through to memory store
    }
  }

  // 2. Fallback to in-memory store
  const result = listMessages({ slug, relationship, cursor, limit });
  if (!result) {
    return NextResponse.json(
      { error: "Celebration not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const honeypot = body.honeypot;
    if (honeypot && String(honeypot).trim()) {
      return NextResponse.json({ accepted: false });
    }

    const guestName = sanitizeText(body.guestName ?? "").replace(/\s+/g, " ");
    const content = sanitizeText(body.content ?? "");
    const relationship = body.relationship ?? "";
    const nameLength = charLength(guestName);
    const contentLength = charLength(content);

    if (nameLength < 2 || nameLength > 50) {
      return NextResponse.json(
        { error: "Please share a name between 2 and 50 characters.", field: "name" },
        { status: 400 },
      );
    }

    if (!isRelationship(relationship)) {
      return NextResponse.json(
        { error: "Choose the relationship that ties you to the couple.", field: "relationship" },
        { status: 400 },
      );
    }

    if (contentLength < 10 || contentLength > 500) {
      return NextResponse.json(
        { error: "A blessing needs between 10 and 500 characters.", field: "content" },
        { status: 400 },
      );
    }

    if (containsProfanity(`${guestName} ${content}`)) {
      return NextResponse.json(
        { error: "Please offer a kind blessing. This wall is kept for the couple.", field: "content" },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supaResult = await insertMessageIntoSupabase({
          slug,
          guestName,
          relationship: relationship as RelationshipType,
          content,
          clientFingerprint: `${ip}:${body.fingerprint || ""}`.slice(0, 100),
        });

        if (supaResult && "message" in supaResult) {
          // Also record in memory store for SSE sync
          createMessage({
            slug,
            guestName,
            relationship,
            content,
            honeypot,
            ip,
          });

          return NextResponse.json(
            { accepted: true, message: supaResult.message },
            { status: 201 },
          );
        } else if (supaResult && "error" in supaResult) {
          return NextResponse.json(
            { error: supaResult.error },
            { status: supaResult.status || 400 },
          );
        }
      } catch {
        // Fallback to in-memory store
      }
    }

    // 2. Fallback to in-memory store
    const result = createMessage({
      slug,
      guestName,
      relationship,
      content,
      honeypot,
      fingerprint: body.fingerprint,
      ip,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, field: result.field },
        { status: result.status },
      );
    }

    return NextResponse.json({ accepted: true, message: result.message }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid blessing submission payload." },
      { status: 400 },
    );
  }
}
