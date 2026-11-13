import { MessageWallClient } from "@/components/message-wall-client";
import { SiteFrame } from "@/components/site-frame";
import { getPublicState } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  fetchEventFromSupabase,
  fetchMessagesFromSupabase,
} from "@/lib/supabase-store";
import { WEDDING, type WeddingState } from "@/lib/guestbook";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let eventState: WeddingState = { slug: WEDDING.slug, isActive: true };
  let messages = getPublicState().messages;

  if (isSupabaseConfigured()) {
    try {
      const [supaEvent, supaMsgs] = await Promise.all([
        fetchEventFromSupabase(WEDDING.slug),
        fetchMessagesFromSupabase({ slug: WEDDING.slug, limit: 50 }),
      ]);
      if (supaEvent) {
        eventState = { slug: supaEvent.slug, isActive: supaEvent.isActive };
      }
      if (supaMsgs && supaMsgs.messages.length > 0) {
        messages = supaMsgs.messages;
      }
    } catch {
      // Fallback to local memory state
    }
  }

  return (
    <SiteFrame>
      <MessageWallClient
        initialEvent={eventState}
        initialMessages={messages}
      />
    </SiteFrame>
  );
}
