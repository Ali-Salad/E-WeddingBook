"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MessageCard } from "@/components/message-card";
import { useNow } from "@/components/use-wall";
import { WEDDING, type PublicMessage } from "@/lib/guestbook";

export function CuratorClient() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const now = useNow();

  // Check auth session
  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) {
          loadCuratorData();
        }
      })
      .catch(() => setAuthenticated(false));
  }, []);

  async function loadCuratorData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${WEDDING.slug}/messages?limit=100`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
      if (typeof data.isActive === "boolean") {
        setIsActive(data.isActive);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setAuthenticated(true);
        loadCuratorData();
      } else {
        setAuthError(data.error || "Incorrect passphrase.");
      }
    } catch {
      setAuthError("Failed to authenticate.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setPassphrase("");
  }

  async function handleToggleStatus() {
    const nextState = !isActive;
    try {
      const res = await fetch("/api/admin/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (res.ok) {
        setIsActive(nextState);
      }
    } catch {
      // Error
    }
  }

  async function handlePin(message: PublicMessage) {
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !message.isPinned }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === message.id ? { ...m, isPinned: !m.isPinned } : m,
          ),
        );
      }
    } catch {
      // Error
    }
  }

  async function handleHide(message: PublicMessage) {
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false }),
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== message.id));
      }
    } catch {
      // Error
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="w-full pt-28 pb-16 min-h-[calc(100vh-140px)] bg-surface">
        <div className="max-w-[1200px] mx-auto px-margin-sm lg:px-margin">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(229,216,190,0.4)]">
            <div>
              <div className="flex items-center gap-2 text-secondary mb-1">
                <span className="material-symbols-outlined text-[20px]">security</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest font-semibold">
                  Curator Portal
                </span>
              </div>
              <h1 className="font-display text-3xl font-semibold text-primary">
                Couple &amp; Admin Console
              </h1>
              <p className="font-body-md text-on-surface-variant">
                Moderate live blessings, toggle wall submission status, and export monograph keepsakes.
              </p>
            </div>

            {authenticated && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm font-semibold hover:bg-surface-container"
                >
                  Sign Out
                </button>
                <Link
                  href="/projector"
                  className="px-4 py-2 rounded-xl bg-secondary-fixed text-primary text-sm font-semibold hover:bg-secondary-fixed-dim flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">tv</span>
                  <span>Projector Mode</span>
                </Link>
              </div>
            )}
          </div>

          {/* Login Form if Not Authenticated */}
          {authenticated === false && (
            <div className="max-w-md mx-auto my-12 p-8 bg-surface-container-lowest rounded-xl shadow-md border border-[rgba(197,160,89,0.25)]">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-surface-container-low mx-auto flex items-center justify-center text-secondary mb-3">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <h2 className="font-headline-sm text-primary font-semibold">
                  Enter Curator Passphrase
                </h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Default passphrase: <code className="bg-surface-container px-1.5 py-0.5 rounded text-primary">hambalyo</code>
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-sm">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="passphrase"
                    className="block font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold mb-1"
                  >
                    Passphrase
                  </label>
                  <input
                    id="passphrase"
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter passphrase..."
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface border border-hairline focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary font-label-md uppercase tracking-wider font-semibold shadow hover:bg-primary transition-colors"
                >
                  Access Console
                </button>
              </form>
            </div>
          )}

          {/* Authenticated Dashboard */}
          {authenticated && (
            <div className="flex flex-col gap-8">
              {/* Controls Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Wall Status Card */}
                <div className="p-5 rounded-xl bg-surface-container-lowest border border-[rgba(197,160,89,0.25)] flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="font-label-sm uppercase tracking-widest text-outline block mb-1">
                      Wall Status
                    </span>
                    <span
                      className={`font-semibold text-lg flex items-center gap-2 ${
                        isActive ? "text-emerald-700" : "text-primary"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isActive ? "bg-emerald-500 animate-pulse" : "bg-primary"
                        }`}
                      />
                      {isActive ? "Submissions Open" : "Read-Only Archive"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className="mt-4 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors"
                  >
                    {isActive ? "Switch to Read-Only" : "Reopen Submissions"}
                  </button>
                </div>

                {/* Total Messages Count */}
                <div className="p-5 rounded-xl bg-surface-container-lowest border border-[rgba(197,160,89,0.25)] flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="font-label-sm uppercase tracking-widest text-outline block mb-1">
                      Approved Blessings
                    </span>
                    <span className="font-display text-3xl font-bold text-primary">
                      {messages.length}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    {messages.filter((m) => m.isPinned).length} pinned to top
                  </span>
                </div>

                {/* Export Card */}
                <div className="p-5 rounded-xl bg-surface-container-lowest border border-[rgba(197,160,89,0.25)] flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="font-label-sm uppercase tracking-widest text-outline block mb-1">
                      Archival Export
                    </span>
                    <span className="font-semibold text-sm text-on-surface">
                      Download keepsake records
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href="/api/admin/export?format=csv"
                      className="px-3 py-1.5 rounded-lg bg-secondary-fixed text-primary text-xs font-semibold hover:bg-secondary-fixed-dim"
                      download
                    >
                      Export CSV
                    </a>
                    <a
                      href="/api/admin/export?format=json"
                      className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container"
                      download
                    >
                      Export JSON
                    </a>
                  </div>
                </div>
              </div>

              {/* Messages Grid */}
              <div>
                <h2 className="font-headline-sm text-primary mb-4">
                  Moderate Messages ({messages.length})
                </h2>

                {loading ? (
                  <div className="text-center py-12 text-on-surface-variant">
                    Loading blessings...
                  </div>
                ) : (
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-space-lg space-y-space-lg">
                    {messages.map((msg) => (
                      <MessageCard
                        key={msg.id}
                        message={msg}
                        now={now}
                        curator={true}
                        onPin={handlePin}
                        onHide={handleHide}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
