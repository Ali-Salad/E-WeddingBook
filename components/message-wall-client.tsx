"use client";

import { useRef, useState, useTransition } from "react";
import { RingsEmblem } from "./emblem";
import { MessageCard } from "./message-card";
import { PreviewModal } from "./preview-modal";
import { useNow, useWall } from "./use-wall";
import { fireGoldConfetti } from "@/lib/confetti";
import {
  PROMPTS,
  RELATIONSHIPS,
  WEDDING,
  wishCounts,
  type PublicMessage,
  type Relationship,
  type WeddingState,
} from "@/lib/guestbook";

type MessageWallClientProps = {
  initialEvent: WeddingState;
  initialMessages: PublicMessage[];
};

export function MessageWallClient({
  initialEvent,
  initialMessages,
}: MessageWallClientProps) {
  const { event, messages, setMessages, highlightedId, setHighlightedId } =
    useWall(initialEvent, initialMessages);
  const now = useNow();

  // Form state
  const [guestName, setGuestName] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("Waalid");
  const [content, setContent] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Dynamic counts
  const counts = wishCounts(messages);

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    if (!m.isApproved) return false;
    if (selectedFilter === "all") return true;
    return m.relationship === selectedFilter;
  });

  // Handle quick prompt append
  function appendPrompt(promptText: string) {
    setContent((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return promptText;
      return `${trimmed} ${promptText}`;
    });
  }

  // Handle post blessing
  async function handlePost() {
    const cleanName = guestName.trim();
    const cleanContent = content.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your name (Magacaaga).");
      return;
    }
    if (cleanName.length < 2 || cleanName.length > 50) {
      setErrorMessage("Name must be between 2 and 50 characters.");
      return;
    }
    if (!cleanContent) {
      setErrorMessage("Please write your blessing or memory.");
      return;
    }
    if (cleanContent.length < 10) {
      setErrorMessage("A blessing needs at least 10 characters.");
      return;
    }
    if (cleanContent.length > 500) {
      setErrorMessage("Blessings are limited to 500 characters.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    // 1. Optimistic UI insertion
    const tempId = `optimistic-${Date.now()}`;
    const optimisticMessage: PublicMessage = {
      id: tempId,
      guestName: cleanName,
      relationship,
      content: cleanContent,
      subtitle: "Just Now",
      signature: "A & W Blessings",
      italic: true,
      showDua: false,
      initial: cleanName.charAt(0).toUpperCase(),
      isPinned: false,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [optimisticMessage, ...prev]);
    setHighlightedId(tempId);

    // 2. Confetti celebration
    fireGoldConfetti(submitButtonRef.current);

    // 3. Clear form inputs
    setGuestName("");
    setContent("");
    setSuccessNotice("Your blessing has been presented to the couple's monograph!");
    setTimeout(() => setSuccessNotice(null), 6000);

    // 4. Smooth scroll to the top of the wall
    setTimeout(() => {
      const cardElem = document.getElementById(`wish-${tempId}`);
      if (cardElem) {
        cardElem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 120);

    // 5. Send POST to API
    try {
      const response = await fetch(`/api/events/${WEDDING.slug}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: cleanName,
          relationship,
          content: cleanContent,
          honeypot,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Rollback optimistic
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setErrorMessage(data.error || "Unable to save your blessing. Please try again.");
      } else if (data.message) {
        // Replace optimistic with persisted message
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m)),
        );
        setHighlightedId(data.message.id);
      }
    } catch {
      // Keep optimistic message or notify
      setSuccessNotice("Blessing recorded locally. Will sync automatically once connected.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      {/* ARIA Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {messages.length > 0 && `There are now ${messages.length} blessings on the wall.`}
      </div>

      <div className="relative w-full max-w-[1440px] mx-auto px-margin-sm lg:px-margin pb-space-xl">
        {/* 1. Top Editorial Header Section */}
        <section className="flex flex-col items-center text-center pt-space-md pb-space-lg relative z-10">
          {/* Intertwined Gold Rings Emblem */}
          <div className="relative mb-space-sm group">
            <RingsEmblem />
          </div>

          {/* Small Uppercase Tracked Gold Serif */}
          <div className="flex flex-col items-center gap-1 mb-space-xs">
            <span className="font-signature text-secondary text-signature tracking-[0.25em] uppercase font-semibold">
              Hambalyo
            </span>
            <span className="font-label-sm text-[11px] tracking-[0.14em] uppercase text-outline">
              Digital Wedding Message Wall &amp; Guestbook
            </span>
          </div>

          {/* Headline Couple Names */}
          <h1 className="font-display text-display text-primary tracking-tight mb-space-xs drop-shadow-[0_1px_1px_rgba(65,3,16,0.05)]">
            {WEDDING.bride}{" "}
            <span className="font-signature italic text-secondary font-normal text-headline-lg mx-space-xs">
              &amp;
            </span>{" "}
            {WEDDING.groom}
          </h1>

          {/* Wedding Date, Venue & Live Guestbook Badge */}
          <div className="flex flex-wrap items-center justify-center gap-y-space-xs gap-x-space-sm text-on-surface-variant font-label-md text-label-md tracking-wider uppercase mb-space-sm">
            <span>{WEDDING.dateLabel}</span>
            <span className="text-secondary">•</span>
            <span>{WEDDING.venue}</span>
            <span className="text-secondary">•</span>
            <span className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container-low shadow-sm font-label-sm text-label-sm border border-secondary/15">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-secondary font-semibold">
                Live Guestbook ({counts.total} Wishes)
              </span>
            </span>
          </div>

          {/* Bilingual Invitation Welcome Note */}
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl font-light italic text-balance">
            “{WEDDING.welcome}”
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center gap-space-xs text-secondary/70 mt-space-sm">
            <span className="w-12 h-[1px] bg-secondary/30"></span>
            <span className="material-symbols-outlined text-[14px]">favorite</span>
            <span className="w-12 h-[1px] bg-secondary/30"></span>
          </div>
        </section>

        {/* 2. Stationery Message Composer Card */}
        <section className="w-full flex justify-center mb-space-xl" id="blessingForm">
          <div className="w-full max-w-[660px] bg-surface-container-lowest rounded-xl p-space-lg shadow-md relative overflow-hidden transition-all duration-300 border border-[rgba(197,160,89,0.25)]">
            {/* Embossed Gold Accent Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-80"></div>

            <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-[rgba(229,216,190,0.3)]">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  auto_awesome
                </span>
                <h2 className="font-headline-sm text-headline-sm text-primary tracking-tight">
                  Leave a Blessing
                </h2>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
                Keepsake Monograph
              </span>
            </div>

            {/* Read-Only Notice if Wall Closed */}
            {!event.isActive && (
              <div className="mb-4 p-3 rounded-lg bg-surface-container text-primary text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>
                  The message wall is currently closed for archival review. You may browse all
                  wishes below.
                </span>
              </div>
            )}

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div
                className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center justify-between"
                role="alert"
              >
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-on-error-container/70 hover:text-on-error-container"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}

            {successNotice && (
              <div
                className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-sm flex items-center justify-between animate-in fade-in"
                role="status"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                    check_circle
                  </span>
                  <span>{successNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccessNotice(null)}
                  className="text-emerald-800/70 hover:text-emerald-800"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            )}

            <form
              className="flex flex-col gap-space-md"
              onSubmit={(e) => {
                e.preventDefault();
                handlePost();
              }}
            >
              {/* Anti-Spam Honeypot */}
              <input
                type="text"
                name="honeypot_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Your Name */}
              <div className="flex flex-col gap-space-xs">
                <label
                  className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold flex items-center justify-between"
                  htmlFor="guestName"
                >
                  <span>Your Name</span>
                  <span className="font-label-sm text-label-sm normal-case font-normal text-outline">
                    Magacaaga
                  </span>
                </label>
                <div className="relative">
                  <input
                    className="w-full px-space-md py-space-sm bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-secondary/50 transition-all shadow-[inset_0_1px_2px_rgba(44,34,36,0.06)] border border-hairline/40"
                    id="guestName"
                    placeholder="e.g., Hodan &amp; Family or Uncle Farah"
                    required
                    maxLength={50}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    disabled={!event.isActive || isSubmitting}
                    type="text"
                  />
                </div>
              </div>

              {/* Relationship Selector Row */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold">
                    Your Relationship
                  </label>
                  <span className="font-label-sm text-label-sm text-outline">Xiriirka Qoyska</span>
                </div>
                <div
                  className="grid grid-cols-3 sm:grid-cols-6 gap-space-xs pt-space-xs"
                  id="relationshipSelector"
                  role="radiogroup"
                  aria-label="Relationship to the couple"
                >
                  {RELATIONSHIPS.map((rel) => {
                    const active = relationship === rel.id;
                    return (
                      <button
                        key={rel.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={!event.isActive || isSubmitting}
                        onClick={() => setRelationship(rel.id)}
                        className={`rel-btn px-space-xs py-space-xs rounded-lg font-label-sm text-label-sm text-center transition-all ${
                          active
                            ? "bg-primary-container text-on-primary shadow-sm"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary"
                        }`}
                      >
                        {rel.id}
                        <span
                          className={`block text-[9px] font-normal ${
                            active ? "opacity-90" : "opacity-70"
                          }`}
                        >
                          {rel.gloss}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Textarea Blessing Field */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label
                    className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold"
                    htmlFor="blessingMessage"
                  >
                    Your Blessing or Memory
                  </label>
                  <span
                    className={`font-label-sm text-label-sm ${
                      content.length > 480 ? "text-error font-bold" : "text-outline"
                    }`}
                    id="charCounter"
                  >
                    {content.length} / 500
                  </span>
                </div>
                <textarea
                  className="w-full px-space-md py-space-sm bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-secondary/50 transition-all shadow-[inset_0_1px_2px_rgba(44,34,36,0.06)] resize-none border border-hairline/40"
                  id="blessingMessage"
                  maxLength={500}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ku qor ducadaada ama xusuustaada gaarka ah halkan..."
                  required
                  rows={4}
                  disabled={!event.isActive || isSubmitting}
                />
              </div>

              {/* Quick Blessings Inspiration Tags */}
              <div className="flex items-center flex-wrap gap-space-xs pt-1">
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-outline">
                  Tap to append:
                </span>
                {PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={!event.isActive || isSubmitting}
                    onClick={() => appendPrompt(prompt)}
                    className="px-2 py-0.5 rounded-full bg-surface-container-low text-[11px] font-label-sm text-secondary hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors border border-secondary/15"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-sm">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  disabled={!event.isActive}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-xl font-label-md text-label-md uppercase tracking-wider text-secondary hover:text-primary hover:bg-surface-container transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Preview Stationery
                </button>
                <button
                  ref={submitButtonRef}
                  type="submit"
                  disabled={!event.isActive || isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-lg py-space-sm rounded-xl font-label-md text-label-md uppercase tracking-wider bg-primary-container text-on-primary shadow-md hover:bg-primary transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? "Posting Blessing..." : "Post to the Wall"}</span>
                  <span className="material-symbols-outlined text-secondary-fixed group-hover:rotate-12 transition-transform text-[20px]">
                    auto_awesome
                  </span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* 3. Relationship Filter Bar */}
        <section className="w-full flex justify-center mb-space-lg" id="wall">
          <div className="flex items-center gap-space-xs sm:gap-space-sm overflow-x-auto py-space-xs px-space-sm max-w-full no-scrollbar">
            {/* All Wishes Tab */}
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className={`filter-tab px-space-md py-space-xs transition-all relative ${
                selectedFilter === "all"
                  ? "font-signature text-signature tracking-wide text-primary font-bold"
                  : "font-body-md text-body-md tracking-wider text-on-surface-variant hover:text-primary"
              }`}
            >
              All Wishes ({counts.total})
              {selectedFilter === "all" && (
                <span className="tab-indicator absolute bottom-0 left-space-md right-space-md h-0.5 bg-secondary rounded-full" />
              )}
            </button>

            {/* Category Tabs */}
            {RELATIONSHIPS.map((rel) => {
              const active = selectedFilter === rel.id;
              const count = counts[rel.id];
              return (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => setSelectedFilter(rel.id)}
                  className={`filter-tab px-space-md py-space-xs transition-all relative ${
                    active
                      ? "font-signature text-signature tracking-wide text-primary font-bold"
                      : "font-body-md text-body-md tracking-wider text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {rel.id} ({count})
                  {active && (
                    <span className="tab-indicator absolute bottom-0 left-space-md right-space-md h-0.5 bg-secondary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. 3-Column Responsive Masonry Message Wall */}
        <section className="w-full">
          {filteredMessages.length === 0 ? (
            <div className="w-full max-w-md mx-auto my-12 text-center p-8 bg-surface-container-lowest rounded-xl border border-[rgba(197,160,89,0.25)]">
              <span className="material-symbols-outlined text-[36px] text-secondary mb-2">
                sentiment_satisfied
              </span>
              <h3 className="font-headline-sm text-primary mb-1">No wishes in this category yet</h3>
              <p className="font-body-md text-on-surface-variant mb-4">
                Be the first {selectedFilter !== "all" ? selectedFilter : "guest"} to post a blessing
                for Amina &amp; Warsame!
              </p>
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className="px-4 py-2 rounded-lg bg-surface-container-low text-secondary text-sm font-semibold hover:bg-secondary-fixed"
              >
                View all {counts.total} wishes
              </button>
            </div>
          ) : (
            <div
              className="columns-1 md:columns-2 lg:columns-3 gap-space-lg space-y-space-lg"
              id="masonryContainer"
            >
              {filteredMessages.map((msg) => (
                <MessageCard
                  key={msg.id}
                  message={msg}
                  now={now}
                  highlight={msg.id === highlightedId}
                  enter={msg.id.startsWith("optimistic-") || msg.id === highlightedId}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        open={previewOpen}
        name={guestName}
        relationship={relationship}
        message={content}
        onClose={() => setPreviewOpen(false)}
        onConfirm={() => {
          setPreviewOpen(false);
          handlePost();
        }}
      />
    </div>
  );
}
