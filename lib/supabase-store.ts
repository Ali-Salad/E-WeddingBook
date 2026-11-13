import { getSupabaseServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/client";
import type { Database, RelationshipType } from "./supabase/types";
import { dbRowToPublicMessage } from "./supabase/mapper";
import {
  WEDDING,
  type PublicMessage,
  type Relationship,
} from "./guestbook";

export { dbRowToPublicMessage };

export async function fetchEventFromSupabase(slug: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    coupleNames: data.couple_names,
    weddingDate: data.wedding_date || WEDDING.dateLabel,
    venue: WEDDING.venue,
    welcomeNote: data.welcome_note || WEDDING.welcome,
    isActive: data.is_active,
  };
}

export async function fetchMessagesFromSupabase(options: {
  slug: string;
  relationship?: string;
  cursor?: string;
  limit?: number;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  // 1. Get event
  const { data: event } = await supabase
    .from("events")
    .select("id, is_active")
    .eq("slug", options.slug)
    .single();

  if (!event) return null;

  // 2. Build messages query
  let query = supabase
    .from("messages")
    .select("*")
    .eq("event_id", event.id)
    .eq("is_approved", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (options.relationship) {
    query = query.eq(
      "relationship",
      options.relationship as RelationshipType,
    );
  }

  if (options.cursor) {
    query = query.lt("created_at", options.cursor);
  }

  const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
  query = query.limit(limit);

  const { data: rows, error } = await query;
  if (error || !rows) return null;

  const messages = rows.map(dbRowToPublicMessage);
  const nextCursor =
    rows.length === limit ? rows[rows.length - 1].created_at : null;

  return {
    messages,
    nextCursor,
    isActive: event.is_active,
  };
}

export async function insertMessageIntoSupabase(input: {
  slug: string;
  guestName: string;
  relationship: RelationshipType;
  content: string;
  clientFingerprint?: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  // 1. Fetch event
  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select("id, is_active")
    .eq("slug", input.slug)
    .single();

  if (eventErr || !event) {
    return { error: "Celebration event not found.", status: 404 };
  }

  if (!event.is_active) {
    return {
      error: "The message wall is currently closed for submissions.",
      status: 403,
    };
  }

  // 2. Insert into messages
  const { data: inserted, error: insertErr } = await supabase
    .from("messages")
    .insert({
      event_id: event.id,
      guest_name: input.guestName,
      relationship: input.relationship,
      content: input.content,
      client_fingerprint: input.clientFingerprint || null,
      is_approved: true,
      is_pinned: false,
    })
    .select()
    .single();

  if (insertErr || !inserted) {
    return { error: "Database error inserting blessing.", status: 500 };
  }

  return { message: dbRowToPublicMessage(inserted) };
}

export async function updateMessageInSupabase(
  id: string,
  patch: { isPinned?: boolean; isApproved?: boolean },
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const updateData: { is_pinned?: boolean; is_approved?: boolean } = {};
  if (typeof patch.isPinned === "boolean") updateData.is_pinned = patch.isPinned;
  if (typeof patch.isApproved === "boolean") updateData.is_approved = patch.isApproved;

  const { data, error } = await supabase
    .from("messages")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return null;
  return dbRowToPublicMessage(data);
}

export async function toggleEventActiveInSupabase(
  slug: string,
  isActive: boolean,
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("events")
    .update({ is_active: isActive })
    .eq("slug", slug)
    .select("is_active")
    .single();

  if (error || !data) return null;
  return data.is_active;
}

export async function exportMessagesFromSupabase(slug: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!event) return null;

  const { data: rows } = await supabase
    .from("messages")
    .select("*")
    .eq("event_id", event.id)
    .eq("is_approved", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (!rows) return [];
  return rows.map(dbRowToPublicMessage);
}
