import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center p-6">
      <span className="font-signature text-secondary text-2xl mb-2">Hambalyo</span>
      <h1 className="font-display text-4xl text-primary font-semibold mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-on-surface-variant mb-6 text-sm">
        The requested blessing or page could not be found in this monograph.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-md uppercase tracking-wider text-xs font-semibold shadow hover:bg-primary transition-colors"
      >
        Return to Wedding Wall
      </Link>
    </div>
  );
}
