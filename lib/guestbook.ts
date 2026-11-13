export const RELATIONSHIPS = [
  { id: "Waalid", gloss: "Elder" },
  { id: "Walal", gloss: "Sibling" },
  { id: "Saaxib", gloss: "Friend" },
  { id: "Xiriir", gloss: "Relative" },
  { id: "Macallin", gloss: "Mentor" },
  { id: "Jaar", gloss: "Neighbor" },
] as const;

export type Relationship = (typeof RELATIONSHIPS)[number]["id"];

export const PROMPTS = [
  "Barakallahu lakuma",
  "Guur barakeysan!",
  "Ubad qeyr qaba",
] as const;

export const WEDDING = {
  slug: "amina-warsame",
  couple: "Amina & Warsame",
  bride: "Amina",
  groom: "Warsame",
  dateLabel: "Friday, October 24, 2025",
  dateShort: "Oct 24, 2025",
  venue: "The Glasshouse Pavilion",
  welcome:
    "Soomaali & English blessings welcome. Leave your warm wishes, cherished memories, and du\u2019aas for the happy couple.",
} as const;

/**
 * Wishes already bound into the printed monograph. They keep the opening
 * counts faithful to the stationery design while the live wall shows the
 * latest cards. New posts add to these numbers.
 */
export const EARLIER_WISHES: Record<Relationship, number> = {
  Waalid: 27,
  Walal: 18,
  Saaxib: 44,
  Xiriir: 31,
  Macallin: 7,
  Jaar: 9,
};

export type PublicMessage = {
  id: string;
  guestName: string;
  relationship: Relationship;
  content: string;
  emphasis?: string;
  subtitle: string;
  signature: string;
  italic: boolean;
  showDua: boolean;
  initial: string;
  isPinned: boolean;
  isApproved: boolean;
  createdAt: string;
};

export type WeddingState = {
  slug: string;
  isActive: boolean;
};

export type WishCounts = Record<Relationship, number> & { total: number };

export function isRelationship(value: string): value is Relationship {
  return RELATIONSHIPS.some((item) => item.id === value);
}

export function charLength(value: string) {
  return Array.from(value).length;
}

export function sortMessages<T extends { isPinned: boolean; createdAt: string }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function wishCounts(
  messages: Pick<PublicMessage, "relationship" | "isApproved">[],
): WishCounts {
  const counts: WishCounts = {
    ...EARLIER_WISHES,
    total: Object.values(EARLIER_WISHES).reduce((sum, count) => sum + count, 0),
  };

  for (const message of messages) {
    if (!message.isApproved) continue;
    counts[message.relationship] += 1;
    counts.total += 1;
  }

  return counts;
}

export function timeAgo(iso: string, now = Date.now()) {
  const delta = Math.max(0, now - new Date(iso).getTime());
  const mins = Math.floor(delta / 60000);
  if (mins < 1) return "Just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function badgeClass(relationship: Relationship) {
  switch (relationship) {
    case "Walal":
      return "bg-wine text-white";
    case "Saaxib":
      return "bg-rose text-burgundy";
    case "Xiriir":
      return "bg-rose-high text-burgundy";
    case "Waalid":
      return "bg-foil/30 text-gold";
    default:
      return "bg-foil/40 text-gold";
  }
}

export function avatarClass(relationship: Relationship) {
  switch (relationship) {
    case "Walal":
      return "bg-[#ffdadb] text-wine";
    case "Saaxib":
      return "bg-rose-high text-burgundy";
    case "Xiriir":
      return "bg-rose-high text-gold";
    case "Macallin":
      return "bg-sand text-[#211b0b]";
    case "Jaar":
      return "bg-foil/50 text-gold";
    default:
      return "bg-foil/40 text-gold";
  }
}
