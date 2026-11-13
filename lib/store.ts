import { randomUUID } from "crypto";
import {
  charLength,
  isRelationship,
  sortMessages,
  WEDDING,
  type PublicMessage,
  type Relationship,
} from "./guestbook";
import { containsProfanity, sanitizeText } from "./moderation";
import { createEvent, createSeedMessages } from "./seed";

type StoredMessage = PublicMessage & { fingerprint?: string };

export type LiveEvent =
  | { type: "insert"; message: PublicMessage }
  | { type: "update"; message: PublicMessage }
  | { type: "status"; isActive: boolean };

type Listener = (event: LiveEvent) => void;

type Store = {
  event: ReturnType<typeof createEvent>;
  messages: StoredMessage[];
  rates: Map<string, number[]>;
  listeners: Set<Listener>;
  curatorToken: string;
};

const globalStore = globalThis as unknown as { __hambalyo?: Store };

function createStore(): Store {
  return {
    event: createEvent(),
    messages: createSeedMessages(),
    rates: new Map(),
    listeners: new Set(),
    curatorToken: randomUUID(),
  };
}

function db() {
  if (!globalStore.__hambalyo) globalStore.__hambalyo = createStore();
  return globalStore.__hambalyo;
}

function toPublic(message: StoredMessage): PublicMessage {
  const publicMessage = { ...message };
  delete publicMessage.fingerprint;
  return publicMessage;
}

function emit(event: LiveEvent) {
  for (const listener of db().listeners) {
    try {
      listener(event);
    } catch {
      db().listeners.delete(listener);
    }
  }
}

export function subscribe(listener: Listener) {
  db().listeners.add(listener);
  return () => db().listeners.delete(listener);
}

export function getCuratorToken() {
  return db().curatorToken;
}

export function getPublicState() {
  const store = db();
  return {
    event: { slug: store.event.slug, isActive: store.event.isActive },
    messages: sortMessages(store.messages.filter((message) => message.isApproved)).map(
      toPublic,
    ),
  };
}

export function getEvent(slug: string) {
  const store = db();
  if (slug !== store.event.slug) return null;
  return {
    slug: WEDDING.slug,
    coupleNames: WEDDING.couple,
    weddingDate: WEDDING.dateLabel,
    venue: WEDDING.venue,
    welcomeNote: WEDDING.welcome,
    isActive: store.event.isActive,
  };
}

export function listMessages(options: {
  slug: string;
  relationship?: string;
  cursor?: string;
  limit?: number;
}) {
  const store = db();
  if (options.slug !== store.event.slug) return null;

  let items = store.messages.filter((message) => message.isApproved);
  if (options.relationship && isRelationship(options.relationship)) {
    items = items.filter((message) => message.relationship === options.relationship);
  }

  items = sortMessages(items);
  if (options.cursor) {
    const cursorTime = new Date(options.cursor).getTime();
    items = items.filter(
      (message) => new Date(message.createdAt).getTime() < cursorTime,
    );
  }

  const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
  const page = items.slice(0, limit);
  const nextCursor = items.length > limit ? page[page.length - 1]?.createdAt ?? null : null;

  return {
    messages: page.map(toPublic),
    nextCursor,
    isActive: store.event.isActive,
  };
}

function rateKey(ip: string, fingerprint: string) {
  return `${ip}:${fingerprint || "anon"}`.slice(0, 180);
}

export function createMessage(input: {
  slug: string;
  guestName: string;
  relationship: string;
  content: string;
  honeypot?: string;
  fingerprint?: string;
  ip: string;
}) {
  const store = db();
  if (input.slug !== store.event.slug) {
    return { ok: false as const, status: 404, error: "This celebration could not be found." };
  }

  if (input.honeypot && input.honeypot.trim()) {
    return { ok: true as const, accepted: false as const };
  }

  if (!store.event.isActive) {
    return {
      ok: false as const,
      status: 403,
      error: "The monograph is now a read-only archive.",
      field: "closed",
    };
  }

  const guestName = sanitizeText(input.guestName).replace(/\s+/g, " ");
  const content = sanitizeText(input.content);
  const nameLength = charLength(guestName);
  const contentLength = charLength(content);

  if (nameLength < 2 || nameLength > 50) {
    return {
      ok: false as const,
      status: 400,
      error: "Please share a name between 2 and 50 characters.",
      field: "name",
    };
  }

  if (!isRelationship(input.relationship)) {
    return {
      ok: false as const,
      status: 400,
      error: "Choose the relationship that ties you to the couple.",
      field: "relationship",
    };
  }

  if (contentLength < 10 || contentLength > 500) {
    return {
      ok: false as const,
      status: 400,
      error: "A blessing needs between 10 and 500 characters.",
      field: "content",
    };
  }

  if (containsProfanity(`${guestName} ${content}`)) {
    return {
      ok: false as const,
      status: 400,
      error: "Please offer a kind blessing. This wall is kept for the couple.",
      field: "content",
    };
  }

  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const key = rateKey(input.ip, input.fingerprint ?? "");
  const recent = (store.rates.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= 3) {
    store.rates.set(key, recent);
    return {
      ok: false as const,
      status: 429,
      error: "The wall is catching its breath. You can leave another blessing in a few minutes.",
      field: "rate",
    };
  }
  recent.push(now);
  store.rates.set(key, recent);

  const relationship = input.relationship as Relationship;
  const message: StoredMessage = {
    id: randomUUID(),
    guestName,
    relationship,
    content,
    subtitle: "Honored Guest",
    signature: "A & W Blessings",
    italic: true,
    showDua: false,
    initial: Array.from(guestName)[0]?.toUpperCase() ?? "H",
    isPinned: false,
    isApproved: true,
    createdAt: new Date(now).toISOString(),
    fingerprint: (input.fingerprint ?? "").slice(0, 80),
  };

  store.messages.unshift(message);
  if (store.messages.length > 500) {
    const oldest = [...store.messages].reverse().find((item) => !item.isPinned);
    if (oldest) store.messages = store.messages.filter((item) => item.id !== oldest.id);
  }

  const pub = toPublic(message);
  emit({ type: "insert", message: pub });
  return { ok: true as const, accepted: true as const, message: pub };
}

export function updateMessage(
  id: string,
  patch: { isPinned?: boolean; isApproved?: boolean },
) {
  const store = db();
  const message = store.messages.find((item) => item.id === id);
  if (!message) return null;
  if (typeof patch.isPinned === "boolean") message.isPinned = patch.isPinned;
  if (typeof patch.isApproved === "boolean") message.isApproved = patch.isApproved;
  const pub = toPublic(message);
  emit({ type: "update", message: pub });
  return pub;
}

export function setWallActive(isActive: boolean) {
  db().event.isActive = isActive;
  emit({ type: "status", isActive });
  return isActive;
}

export function exportMessages() {
  return sortMessages(db().messages.filter((message) => message.isApproved)).map(toPublic);
}
