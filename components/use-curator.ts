"use client";

import { useEffect, useState } from "react";

export function useCurator() {
  const [curator, setCurator] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { authenticated?: boolean }) => {
        if (!cancelled) setCurator(Boolean(data.authenticated));
      })
      .catch(() => {
        if (!cancelled) setCurator(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { curator, setCurator };
}
