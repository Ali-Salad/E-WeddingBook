"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RingsEmblem } from "@/components/emblem";
import { useNow, useWall } from "@/components/use-wall";
import { WEDDING, type PublicMessage, type WeddingState } from "@/lib/guestbook";

export function ProjectorClient() {
  const [initialData, setInitialData] = useState<{
    event: WeddingState;
    messages: PublicMessage[];
  } | null>(null);

  useEffect(() => {
    fetch(`/api/events/${WEDDING.slug}/messages?limit=60`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setInitialData({
            event: { slug: WEDDING.slug, isActive: data.isActive ?? true },
            messages: data.messages,
          });
        }
      })
      .catch(() => {
        setInitialData({
          event: { slug: WEDDING.slug, isActive: true },
          messages: [],
        });
      });
  }, []);

  if (!initialData) {
    return (
      <div className="min-h-screen bg-[#1E0F12] flex items-center justify-center text-[#E5C787]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <RingsEmblem />
          <span className="font-signature text-xl tracking-widest uppercase">
            Loading Live Projection...
          </span>
        </div>
      </div>
    );
  }

  return (
    <ProjectorView
      initialEvent={initialData.event}
      initialMessages={initialData.messages}
    />
  );
}

function ProjectorView({
  initialEvent,
  initialMessages,
}: {
  initialEvent: WeddingState;
  initialMessages: PublicMessage[];
}) {
  const { messages, highlightedId } = useWall(initialEvent, initialMessages);
  const now = useNow();

  // Latest spotlighted message
  const spotlightMessage = messages[0];

  return (
    <div className="min-h-screen bg-[#241316] text-[#FAF8F5] p-6 lg:p-12 flex flex-col justify-between overflow-x-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-[#C5A059]/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#3D1E24] flex items-center justify-center border border-[#C5A059]/40">
            <span className="font-signature text-2xl text-[#E5C787] italic">H</span>
          </div>
          <div>
            <h1 className="font-signature text-2xl lg:text-3xl tracking-widest uppercase text-[#E5C787] font-semibold">
              Hambalyo
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#FAF8F5]/70">
              {WEDDING.couple} • Live Reception Wall
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D1E24] border border-[#C5A059]/30">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E5C787]">
              {messages.length} Live Blessings
            </span>
          </div>

          <Link
            href="/"
            className="text-xs text-[#E5C787]/70 hover:text-[#E5C787] uppercase tracking-wider border border-[#C5A059]/30 px-3 py-1.5 rounded-lg"
          >
            Exit Projector
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="my-8 flex-1 flex flex-col justify-center">
        {spotlightMessage ? (
          <div className="max-w-4xl mx-auto w-full my-auto text-center py-8 px-6 rounded-2xl bg-[#33171D]/90 border-2 border-[#C5A059]/50 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#461F27] border border-[#C5A059]/40 text-[#E5C787] text-xs font-semibold uppercase tracking-widest">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              Latest Blessing from {spotlightMessage.relationship}
            </div>

            <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight italic text-[#FAF8F5] mb-8">
              “{spotlightMessage.content}”
            </p>

            <div className="flex items-center justify-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#461F27] flex items-center justify-center font-signature text-[#E5C787] font-bold text-lg border border-[#C5A059]/30">
                {spotlightMessage.initial || spotlightMessage.guestName.charAt(0)}
              </span>
              <div className="text-left">
                <span className="font-display text-2xl font-semibold text-[#E5C787] block leading-tight">
                  {spotlightMessage.guestName}
                </span>
                <span className="text-xs text-[#FAF8F5]/60 uppercase tracking-wider">
                  {spotlightMessage.subtitle || "Honored Wedding Guest"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-[#E5C787]">
            <h2 className="font-display text-4xl mb-2">Welcome to the Celebration</h2>
            <p className="text-lg opacity-80">Scan the QR code on your table to leave a blessing!</p>
          </div>
        )}
      </main>

      {/* Bottom Ticker Stream */}
      <footer className="pt-6 border-t border-[#C5A059]/30">
        <div className="flex items-center justify-between text-xs text-[#FAF8F5]/60 mb-3">
          <span className="uppercase tracking-widest font-semibold text-[#E5C787]">
            Recent Blessings
          </span>
          <span>{WEDDING.venue} • Live Event Sync</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {messages.slice(0, 4).map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-xl bg-[#33171D] border border-[#C5A059]/30 flex flex-col justify-between ${
                msg.id === highlightedId ? "ring-2 ring-[#E5C787]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[#E5C787] truncate">
                  {msg.guestName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#461F27] text-[#FAF8F5]/80 uppercase">
                  {msg.relationship}
                </span>
              </div>
              <p className="text-xs text-[#FAF8F5]/90 line-clamp-3 italic mb-2">
                “{msg.content}”
              </p>
              <span className="font-signature text-xs text-[#E5C787]/70 text-right">
                {msg.signature || "A & W"}
              </span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
