export function SiteFooter() {
  return (
    <footer className="w-full bg-surface-container-low shadow-[inset_0_1px_0_rgba(229,216,190,0.4)] py-space-xl">
      <div className="max-w-[1440px] mx-auto px-margin-sm lg:px-margin flex flex-col items-center justify-center text-center gap-space-sm">
        <div className="flex items-center gap-space-sm text-secondary">
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span className="font-signature text-secondary text-signature italic">Hambalyo</span>
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
          Hambalyo — The Digital Wedding Message Wall &amp; Guestbook Platform. Celebrating couples, love, and community every day.
        </p>
        <p className="font-label-sm text-[10px] tracking-widest uppercase text-outline mt-space-xs">
          © 2025 Hambalyo • Digital Wedding Stationery &amp; Archival Monographs
        </p>
      </div>
    </footer>
  );
}
