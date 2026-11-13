"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  sortMessages,
  WEDDING,
  type PublicMessage,
  type WeddingState,
} from "@/lib/guestbook";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { dbRowToPublicMessage } from "@/lib/supabase/mapper";
import type { Database } from "@/lib/supabase/types";

type LiveEvent =
  | { type: "insert"; message: PublicMessage }
  | { type: "update"; message: PublicMessage }
  | { type: "status"; isActive: boolean }
  | { type: "hello" };

function mergeInsert(list: PublicMessage[], message: PublicMessage) {
  const cleaned = list.filter((item) => {
    if (item.id === message.id) return false;
    const optimistic =
      item.id.startsWith("optimistic-") &&
      item.guestName === message.guestName &&
      item.content === message.content;
    return !optimistic;
  });
  return sortMessages([message, ...cleaned]);
}

export function useWall(initialEvent: WeddingState, initialMessages: PublicMessage[]) {
  const [event, setEvent] = useState(initialEvent);
  const [messages, setMessages] = useState(initialMessages);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const apply = useCallback((payload: LiveEvent) => {
    if (payload.type === "insert") {
      setMessages((current) => mergeInsert(current, payload.message));
      setHighlightedId(payload.message.id);
    } else if (payload.type === "update") {
      setMessages((current) => {
        if (!payload.message.isApproved) {
          return current.filter((item) => item.id !== payload.message.id);
        }
        const exists = current.some((item) => item.id === payload.message.id);
        const next = exists
          ? current.map((item) => (item.id === payload.message.id ? payload.message : item))
          : [payload.message, ...current];
        return sortMessages(next);
      });
    } else if (payload.type === "status") {
      setEvent((current) => ({ ...current, isActive: payload.isActive }));
    }
  }, []);

  useEffect(() => {
    // 1. Try Supabase Realtime channel if client is available
    const supabase = getSupabaseBrowserClient();
    let supabaseChannel: ReturnType<NonNullable<typeof supabase>["channel"]> | null = null;

    if (supabase) {
      supabaseChannel = supabase
        .channel("public:messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const row = payload.new as Database["public"]["Tables"]["messages"]["Row"];
            const msg = dbRowToPublicMessage(row);
            if (msg.isApproved) {
              apply({ type: "insert", message: msg });
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const row = payload.new as Database["public"]["Tables"]["messages"]["Row"];
            const msg = dbRowToPublicMessage(row);
            apply({ type: "update", message: msg });
          },
        )
        .subscribe();
    }

    // 2. Server-Sent Events stream (for local store / SSE broadcast)
    const source = new EventSource(`/api/events/${WEDDING.slug}/stream`);
    source.onmessage = (eventMessage) => {
      try {
        apply(JSON.parse(eventMessage.data) as LiveEvent);
      } catch {
        /* ignore malformed frames */
      }
    };

    // 3. Fallback poll interval
    const poll = window.setInterval(async () => {
      if (document.hidden) return;
      try {
        const response = await fetch(`/api/events/${WEDDING.slug}/messages?limit=50`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as {
          messages: PublicMessage[];
          isActive: boolean;
        };
        setEvent((current) => ({ ...current, isActive: data.isActive }));
        setMessages((current) => {
          const pending = current.filter((item) => item.id.startsWith("optimistic-"));
          return sortMessages([...pending, ...data.messages]);
        });
      } catch {
        /* offline poll is expected in a banquet hall */
      }
    }, 8000);

    return () => {
      if (supabase && supabaseChannel) {
        supabase.removeChannel(supabaseChannel);
      }
      source.close();
      window.clearInterval(poll);
    };
  }, [apply]);

  return {
    event,
    messages,
    setMessages,
    highlightedId,
    setHighlightedId,
  };
}

export function useNow(interval = 30000) {
  const [now, setNow] = useState(() => Date.now());
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(() => setNow(Date.now()), interval);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [interval]);

  return now;
}
