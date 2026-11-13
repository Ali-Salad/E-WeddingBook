import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RingsEmblem } from "@/components/emblem";
import { WEDDING } from "@/lib/guestbook";

export const dynamic = "force-dynamic";

export default function CelebrationPage() {
  return (
    <>
      <SiteHeader />
      <main className="w-full pt-28 pb-16 min-h-[calc(100vh-140px)] bg-surface">
        <div className="max-w-[1000px] mx-auto px-margin-sm lg:px-margin">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <RingsEmblem />
            </div>
            <span className="font-signature text-secondary text-signature tracking-[0.25em] uppercase font-medium">
              The Celebration
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-primary font-semibold mt-2 mb-3">
              {WEDDING.couple}
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto italic">
              {WEDDING.dateLabel} • {WEDDING.venue}
            </p>
          </div>

          {/* Program Schedule */}
          <section className="mb-12 p-8 bg-surface-container-lowest rounded-xl shadow-sm border border-[rgba(197,160,89,0.25)]">
            <div className="flex items-center gap-2 mb-6 border-b border-[rgba(229,216,190,0.3)] pb-3">
              <span className="material-symbols-outlined text-secondary">schedule</span>
              <h2 className="font-headline-sm text-primary font-semibold">
                Order of Events
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low">
                <span className="font-signature text-secondary font-bold text-lg shrink-0">
                  4:00 PM
                </span>
                <div>
                  <h3 className="font-semibold text-on-surface">Guest Arrival &amp; Welcome</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Light refreshments, live oud melodies, and guestbook signing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low">
                <span className="font-signature text-secondary font-bold text-lg shrink-0">
                  5:00 PM
                </span>
                <div>
                  <h3 className="font-semibold text-on-surface">The Sacred Nikaah</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Solemn vows, elders’ du’aas, and exchange of rings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low">
                <span className="font-signature text-secondary font-bold text-lg shrink-0">
                  6:30 PM
                </span>
                <div>
                  <h3 className="font-semibold text-on-surface">Banquet &amp; Speeches</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Multi-course dinner, traditional Somali cuisine, toasts from family and friends.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low">
                <span className="font-signature text-secondary font-bold text-lg shrink-0">
                  8:30 PM
                </span>
                <div>
                  <h3 className="font-semibold text-on-surface">Dhaanto &amp; Festivities</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Live Somali music, celebratory dances, and cake cutting ceremony.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Venue & Attire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <section className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-[rgba(197,160,89,0.25)]">
              <div className="flex items-center gap-2 mb-3 text-secondary">
                <span className="material-symbols-outlined">location_on</span>
                <h3 className="font-headline-sm text-primary font-semibold">The Venue</h3>
              </div>
              <p className="font-semibold text-on-surface">{WEDDING.venue}</p>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                Surrounded by botanical gardens and natural light under panoramic glass arches. Valet parking provided at the main gate.
              </p>
            </section>

            <section className="p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-[rgba(197,160,89,0.25)]">
              <div className="flex items-center gap-2 mb-3 text-secondary">
                <span className="material-symbols-outlined">styler</span>
                <h3 className="font-headline-sm text-primary font-semibold">Attire</h3>
              </div>
              <p className="font-semibold text-on-surface">Black Tie &amp; Elegant Traditional</p>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                Somali traditional Dirac, Guntiino, and Western formal wear. Rich jewel tones and gold accents are warmly welcomed.
              </p>
            </section>
          </div>

          {/* CTA back to guestbook */}
          <div className="text-center p-8 bg-surface-container-low rounded-xl border border-[rgba(229,216,190,0.5)]">
            <h3 className="font-headline-sm text-primary font-semibold mb-2">
              Have you left your blessing yet?
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Your words will be immortalized in Amina &amp; Warsame’s official wedding monograph.
            </p>
            <Link
              href="/#blessingForm"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-md uppercase tracking-wider font-semibold shadow hover:bg-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              <span>Leave a Blessing</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
