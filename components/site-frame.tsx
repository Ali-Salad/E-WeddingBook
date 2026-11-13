import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-surface-container-lowest focus:px-4 focus:py-2 focus:text-primary focus:shadow-md"
      >
        Skip to blessings
      </a>
      <SiteHeader />
      <main id="content" className="w-full pt-20 bg-surface min-h-[calc(100vh-140px)]">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
