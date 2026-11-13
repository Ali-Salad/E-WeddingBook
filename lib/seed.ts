import { WEDDING, type PublicMessage } from "./guestbook";

const minute = 60 * 1000;

export function createSeedMessages(now = Date.now()): PublicMessage[] {
  return [
    {
      id: "seed-ayeeyo",
      guestName: "Ayeeyo Maryan & Oday Guuleed",
      relationship: "Waalid",
      content:
        "Guurkiina ha noqdo mid barakeysan oo lagu nasto. Waxaan idiin rajeyneynaa nolol buuxda oo naxariis, jacayl iyo ubad khayr qaba leh. Hambalyo boqorka iyo boqoradda!",
      subtitle: "Elders \u2022 Hargeisa & London",
      signature: "A & W Blessings",
      italic: true,
      showDua: false,
      initial: "M",
      isPinned: false,
      isApproved: true,
      createdAt: new Date(now - 3 * minute).toISOString(),
    },
    {
      id: "seed-khadar",
      guestName: "Dr. Khadar & Samira Al-Mansoor",
      relationship: "Saaxib",
      content:
        "Wishing you both a lifetime of unyielding love, immense barakah, and joyous laughter. Warsame, you found a true gem in Amina, and Amina, a gentleman who cherishes you beyond words. What an unforgettable night!",
      subtitle: "Close Companions",
      signature: "Du\u2019aa",
      italic: false,
      showDua: true,
      initial: "K",
      isPinned: false,
      isApproved: true,
      createdAt: new Date(now - 14 * minute).toISOString(),
    },
    {
      id: "seed-farxiyo",
      guestName: "Farxiyo Warsame",
      relationship: "Walal",
      content:
        "To my dearest brother Warsame and my gorgeous new sister Amina! From our childhood games in Borama to watching you stand hand-in-hand today, my heart is overflowing with pure happiness. Ducada walal mar walba waa idin la jirtaa.",
      subtitle: "Groom\u2019s Sister",
      signature: "Walalnimo",
      italic: false,
      showDua: false,
      initial: "F",
      isPinned: false,
      isApproved: true,
      createdAt: new Date(now - 28 * minute).toISOString(),
    },
    {
      id: "seed-hassan",
      guestName: "Prof. Hassan Nur",
      relationship: "Macallin",
      emphasis:
        "Barakallahu laka wa baraka alayka wa jama\u2019a baynakuma fee khayr.",
      content:
        "May Allah bless your union with eternal peace, intellectual companionship, and mutual understanding. Deeply honored to witness this sacred milestone.",
      subtitle: "Mentor & Family Friend",
      signature: "Du\u2019aa",
      italic: false,
      showDua: false,
      initial: "H",
      isPinned: false,
      isApproved: true,
      createdAt: new Date(now - 60 * minute).toISOString(),
    },
    {
      id: "seed-osman",
      guestName: "The Osman Family",
      relationship: "Xiriir",
      content:
        "Hambalyo arooskiina wacan! So deeply delighted to celebrate this sacred union together. May every chapter ahead be sweeter than the last, filled with hospitality, travels, and warmth.",
      subtitle: "Cousins \u2022 Toronto",
      signature: "Farxad",
      italic: false,
      showDua: false,
      initial: "O",
      isPinned: false,
      isApproved: true,
      createdAt: new Date(now - 2 * 60 * minute).toISOString(),
    },
    {
      id: "seed-safia",
      guestName: "Safia & Jamal (Seattle)",
      relationship: "Jaar",
      content:
        "Sending our warmest blessings across the miles! You two look breathtaking. May your home be forever anchored in tranquility, affection, and endless hospitality.",
      subtitle: "Lifelong Neighbors",
      signature: "Nabad & Caano",
      italic: false,
      showDua: false,
      initial: "S",
      isPinned: false,
      isApproved: true,
      createdAt: new Date(now - 3 * 60 * minute).toISOString(),
    },
  ];
}

export function createEvent() {
  return {
    id: "event-amina-warsame",
    slug: WEDDING.slug,
    isActive: true,
  };
}
