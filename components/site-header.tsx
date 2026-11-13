"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MonogramMark } from "./emblem";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isWall = pathname === "/";
  const isCelebration = pathname === "/celebration";
  const isKeepsake = pathname === "/keepsake";
  const isCurator = pathname === "/curator";

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(44,34,36,0.04)] border-b border-[rgba(229,216,190,0.45)]">
      <div className="h-20 max-w-[1440px] mx-auto px-margin-sm lg:px-margin flex items-center justify-between">
        {/* Left: Brand Name Only "Hambalyo" */}
        <div className="flex items-center gap-space-md">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileOpen(false)}
          >
            <MonogramMark />
            <span className="font-serif text-[21px] tracking-[0.18em] uppercase text-primary font-semibold group-hover:text-secondary transition-colors">
              Hambalyo
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-space-lg" aria-label="Main Navigation">
          <a
            href={isWall ? "#blessingForm" : "/#blessingForm"}
            className="font-label-md text-label-md tracking-wider uppercase text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Leave Blessing
          </a>
          <Link
            href="/"
            className={`font-label-md text-label-md tracking-wider uppercase transition-colors ${
              isWall ? "text-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Message Wall
          </Link>
          <Link
            href="/celebration"
            className={`font-label-md text-label-md tracking-wider uppercase transition-colors ${
              isCelebration ? "text-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Celebration
          </Link>
          <Link
            href="/keepsake"
            className={`font-label-md text-label-md tracking-wider uppercase transition-colors ${
              isKeepsake ? "text-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Couple Keepsake
          </Link>
        </nav>

        {/* Right: Curator Link & User Button & Mobile Toggle */}
        <div className="flex items-center gap-space-md">
          <Link
            href="/curator"
            className={`hidden sm:inline-flex items-center justify-center font-label-sm text-label-sm tracking-widest uppercase px-space-md py-space-xs rounded-full transition-colors ${
              isCurator
                ? "bg-secondary-fixed text-primary font-semibold"
                : "text-secondary hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] mr-space-xs">lock</span>
            Curator
          </Link>
          <Link
            href="/curator"
            aria-label="Curator Access"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-container transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </Link>
          <button
            type="button"
            className="lg:hidden p-1.5 text-secondary hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-hairline/60 bg-surface px-margin-sm py-space-md shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-space-sm" aria-label="Mobile Navigation">
            <a
              href="#blessingForm"
              onClick={() => setMobileOpen(false)}
              className="px-space-sm py-space-xs font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg"
            >
              Leave Blessing
            </a>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`px-space-sm py-space-xs font-label-md text-label-md uppercase tracking-wider rounded-lg ${
                isWall ? "text-primary font-bold bg-surface-container-low" : "text-on-surface-variant"
              }`}
            >
              Message Wall
            </Link>
            <Link
              href="/celebration"
              onClick={() => setMobileOpen(false)}
              className={`px-space-sm py-space-xs font-label-md text-label-md uppercase tracking-wider rounded-lg ${
                isCelebration ? "text-primary font-bold bg-surface-container-low" : "text-on-surface-variant"
              }`}
            >
              Celebration
            </Link>
            <Link
              href="/keepsake"
              onClick={() => setMobileOpen(false)}
              className={`px-space-sm py-space-xs font-label-md text-label-md uppercase tracking-wider rounded-lg ${
                isKeepsake ? "text-primary font-bold bg-surface-container-low" : "text-on-surface-variant"
              }`}
            >
              Couple Keepsake
            </Link>
            <Link
              href="/projector"
              onClick={() => setMobileOpen(false)}
              className="px-space-sm py-space-xs font-label-md text-label-md uppercase tracking-wider text-secondary hover:bg-surface-container-low rounded-lg flex items-center justify-between"
            >
              <span>Live Projector Mode</span>
              <span className="material-symbols-outlined text-[18px]">tv</span>
            </Link>
            <Link
              href="/curator"
              onClick={() => setMobileOpen(false)}
              className={`px-space-sm py-space-xs font-label-md text-label-md uppercase tracking-wider rounded-lg flex items-center gap-1.5 ${
                isCurator ? "text-primary font-bold bg-surface-container-low" : "text-secondary"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Curator Portal</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
