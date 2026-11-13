import type { Database } from "./types";
import { type PublicMessage, type Relationship } from "@/lib/guestbook";

export function dbRowToPublicMessage(
  row: Database["public"]["Tables"]["messages"]["Row"],
): PublicMessage {
  const isWaalid = row.relationship === "Waalid";
  const isSaaxib = row.relationship === "Saaxib";
  const contentLower = row.content.toLowerCase();
  const hasDua =
    contentLower.includes("baraka") ||
    contentLower.includes("ducad") ||
    contentLower.includes("du'aa") ||
    contentLower.includes("du’aa");
  const initial = Array.from(row.guest_name)[0]?.toUpperCase() || "H";

  let subtitle = "Honored Guest";
  let signature = "A & W Blessings";

  switch (row.relationship) {
    case "Waalid":
      subtitle = "Elder";
      signature = "A & W Blessings";
      break;
    case "Walal":
      subtitle = "Sibling";
      signature = "Walalnimo";
      break;
    case "Saaxib":
      subtitle = "Close Companion";
      signature = hasDua ? "Du’aa" : "Farxad";
      break;
    case "Macallin":
      subtitle = "Mentor & Family Friend";
      signature = "Du’aa";
      break;
    case "Xiriir":
      subtitle = "Relative";
      signature = "Farxad";
      break;
    case "Jaar":
      subtitle = "Neighbor";
      signature = "Nabad & Caano";
      break;
  }

  return {
    id: row.id,
    guestName: row.guest_name,
    relationship: row.relationship as Relationship,
    content: row.content,
    subtitle,
    signature,
    italic: isWaalid,
    showDua: hasDua,
    initial,
    isPinned: row.is_pinned,
    isApproved: row.is_approved,
    createdAt: row.created_at,
  };
}
