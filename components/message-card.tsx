"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { type PublicMessage, timeAgo } from "@/lib/guestbook";

type MessageCardProps = {
  message: PublicMessage;
  now: number;
  highlight?: boolean;
  enter?: boolean;
  curator?: boolean;
  onPin?: (message: PublicMessage) => void;
  onHide?: (message: PublicMessage) => void;
};

export function MessageCard({
  message,
  now,
  highlight = false,
  enter = false,
  curator = false,
  onPin,
  onHide,
}: MessageCardProps) {
  const reduce = useReducedMotion();
  const [confirmHide, setConfirmHide] = useState(false);
  const createdDate = new Date(message.createdAt).getTime();
  const fresh = now - createdDate < 2 * 60 * 1000;

  // Avatar styling based on relationship
  function getAvatarClass(rel: string) {
    switch (rel) {
      case "Waalid":
        return "bg-secondary-fixed/40 text-secondary";
      case "Walal":
        return "bg-primary-fixed text-primary-container";
      case "Saaxib":
        return "bg-surface-container-high text-primary";
      case "Macallin":
        return "bg-tertiary-fixed text-on-tertiary-fixed";
      case "Xiriir":
        return "bg-surface-container-high text-secondary";
      case "Jaar":
        return "bg-secondary-fixed/50 text-secondary";
      default:
        return "bg-secondary-fixed/40 text-secondary";
    }
  }

  // Badge styling based on relationship
  function getBadgeClass(rel: string) {
    switch (rel) {
      case "Waalid":
        return "bg-secondary-fixed/30 text-secondary border border-secondary/20";
      case "Walal":
        return "bg-primary-container text-on-primary";
      case "Saaxib":
        return "bg-surface-container text-primary";
      case "Macallin":
        return "bg-secondary-fixed/40 text-secondary";
      case "Xiriir":
        return "bg-surface-container-high text-primary";
      case "Jaar":
        return "bg-secondary-fixed/40 text-secondary";
      default:
        return "bg-secondary-fixed/30 text-secondary";
    }
  }

  return (
    <motion.article
      id={`wish-${message.id}`}
      initial={enter && !reduce ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      data-rel={message.relationship}
      className={`blessing-card break-inside-avoid bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between group border ${
        message.isPinned
          ? "border-secondary/60 ring-1 ring-secondary/30 shadow-md"
          : "border-[rgba(197,160,89,0.25)] hover:border-secondary/50"
      } ${highlight ? "card-live ring-2 ring-secondary" : ""}`}
    >
      {/* Top Gold Foil Hairline on Hover/Pinned */}
      {message.isPinned && (
        <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-secondary-fixed via-secondary to-secondary-fixed rounded-full" />
      )}

      {/* Header Row */}
      <div>
        <div className="flex items-start justify-between gap-space-xs mb-space-md">
          <div className="flex items-center gap-space-xs">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center font-signature font-bold text-sm ${getAvatarClass(
                message.relationship,
              )}`}
            >
              {message.initial || message.guestName.charAt(0).toUpperCase()}
            </span>
            <div className="flex flex-col min-w-0">
              <h3 className="font-headline-sm text-[19px] leading-tight text-on-surface font-semibold truncate">
                {message.guestName}
              </h3>
              <span className="font-label-sm text-[11px] text-outline truncate">
                {message.subtitle || "Honored Guest"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {message.isPinned && (
              <span
                className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[9px] uppercase tracking-wider font-bold flex items-center gap-0.5"
                title="Pinned blessing"
              >
                <span className="material-symbols-outlined text-[12px]">keep</span>
                Pinned
              </span>
            )}
            <span
              className={`px-space-xs py-0.5 rounded-full font-label-sm text-[10px] tracking-wider uppercase font-semibold ${getBadgeClass(
                message.relationship,
              )}`}
            >
              {message.relationship}
            </span>
          </div>
        </div>

        {/* Message Content */}
        <p
          className={`font-body-md text-body-md text-on-surface leading-relaxed mb-space-md font-normal ${
            message.italic ? "italic" : ""
          }`}
        >
          {message.emphasis && (
            <span className="font-signature italic text-primary block mb-1">
              {message.emphasis}
            </span>
          )}
          “{message.content}”
        </p>
      </div>

      {/* Footer Row */}
      <div className="pt-space-xs border-t border-[rgba(229,216,190,0.35)] flex items-center justify-between text-outline font-label-sm text-label-sm">
        <span className="flex items-center gap-1">
          {fresh ? (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live entry
            </span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span suppressHydrationWarning>{timeAgo(message.createdAt, now)}</span>
            </>
          )}
        </span>

        {message.showDua ? (
          <div className="flex items-center gap-1 text-primary">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span className="text-[11px]">Du’aa</span>
          </div>
        ) : (
          <span className="font-signature italic text-secondary text-signature">
            {message.signature || "A & W Blessings"}
          </span>
        )}
      </div>

      {/* Curator Moderation Controls */}
      {curator && (
        <div className="mt-space-sm pt-space-xs border-t border-dashed border-hairline/80 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onPin?.(message)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-label-sm uppercase transition-colors ${
              message.isPinned
                ? "bg-secondary text-white font-bold"
                : "bg-surface-container-low text-secondary hover:bg-secondary-fixed"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {message.isPinned ? "keep_off" : "keep"}
            </span>
            <span>{message.isPinned ? "Unpin" : "Pin to Top"}</span>
          </button>

          {confirmHide ? (
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-error font-medium">Hide?</span>
              <button
                type="button"
                onClick={() => {
                  onHide?.(message);
                  setConfirmHide(false);
                }}
                className="px-2 py-0.5 rounded bg-error text-white text-[11px] font-semibold hover:bg-error/90"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirmHide(false)}
                className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-[11px]"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmHide(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-error hover:bg-error-container/40 transition-colors"
              title="Hide or delete message"
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
              <span>Remove</span>
            </button>
          )}
        </div>
      )}
    </motion.article>
  );
}
