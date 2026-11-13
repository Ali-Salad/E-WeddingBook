"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RingsEmblem } from "@/components/emblem";
import { WEDDING, type PublicMessage } from "@/lib/guestbook";

export function KeepsakeClient() {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${WEDDING.slug}/messages?limit=100`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="no-print">
        <SiteHeader />
      </div>

      <main className="w-full pt-28 pb-16 min-h-screen bg-surface print:pt-0 print:pb-0 print:bg-white">
        <div className="max-w-[900px] mx-auto px-margin-sm lg:px-margin print:max-w-none print:px-8">
          {/* Print Toolbar */}
          <div className="no-print mb-8 p-4 bg-surface-container-low rounded-xl border border-[rgba(229,216,190,0.6)] flex items-center justify-between">
            <div>
              <span className="font-semibold text-sm text-primary block">
                Archival Keepsake Monograph
              </span>
              <span className="text-xs text-on-surface-variant">
                Formatted for print and PDF archiving (US Letter / A4).
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary text-xs font-semibold uppercase tracking-wider shadow hover:bg-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Keepsake</span>
              </button>
              <a
                href="/api/admin/export?format=csv"
                download
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>CSV</span>
              </a>
            </div>
          </div>

          {/* Archival Monograph Cover Page (in print) */}
          <div className="text-center py-12 border-b-2 border-secondary/40 mb-12">
            <div className="flex justify-center mb-6">
              <RingsEmblem />
            </div>
            <span className="font-signature text-secondary text-signature tracking-[0.3em] uppercase font-semibold">
              The Official Wedding Monograph
            </span>
            <h1 className="font-display text-4xl sm:text-6xl text-primary font-semibold mt-3 mb-4">
              {WEDDING.couple}
            </h1>
            <p className="font-body-md text-on-surface-variant uppercase tracking-widest text-xs mb-2">
              Solemnized On {WEDDING.dateLabel}
            </p>
            <p className="font-signature italic text-secondary text-lg">
              {WEDDING.venue}
            </p>
            <div className="w-16 h-0.5 bg-secondary mx-auto mt-6" />
          </div>

          {/* Bound Blessings */}
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant">
              Compiling archival monograph...
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[rgba(229,216,190,0.5)]">
              {messages.map((msg, index) => (
                <article
                  key={msg.id}
                  className="py-8 break-inside-avoid"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-signature text-secondary text-sm">
                        #{index + 1}
                      </span>
                      <h3 className="font-headline-sm text-xl font-semibold text-primary">
                        {msg.guestName}
                      </h3>
                      <span className="text-xs text-outline italic">
                        ({msg.relationship})
                      </span>
                    </div>
                    <span className="text-[11px] text-outline font-mono">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <blockquote className="font-serif text-lg leading-relaxed text-on-surface italic pl-4 border-l-2 border-secondary/40 my-3">
                    “{msg.content}”
                  </blockquote>

                  <div className="text-right text-xs font-signature italic text-secondary">
                    {msg.signature || "A & W Blessings"}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Archival Colophon */}
          <div className="mt-16 pt-8 border-t-2 border-secondary/40 text-center text-xs text-outline pb-12">
            <p className="font-signature text-secondary text-base italic mb-1">
              Hambalyo Monograph Archive
            </p>
            <p>© 2025 Amina &amp; Warsame. In celebration of love, barakah, and family.</p>
          </div>
        </div>
      </main>

      <div className="no-print">
        <SiteFooter />
      </div>
    </>
  );
}
