const BLOCKED = new Set([
  "fuck",
  "fucking",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "nigger",
  "nigga",
  "faggot",
  "retard",
  "wasmo",
  "dhillo",
  "sharmuto",
]);

export function sanitizeText(input: string) {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function containsProfanity(input: string) {
  const words = input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  return words.some((word) => BLOCKED.has(word));
}
