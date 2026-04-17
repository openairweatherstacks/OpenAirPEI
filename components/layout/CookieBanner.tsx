"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("openair-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("openair-cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("openair-cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[2000] px-4 pb-2 md:bottom-4">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-[1.5rem] border border-border bg-white/95 p-4 shadow-[0_8px_40px_rgba(42,42,42,0.12)] backdrop-blur sm:flex-row sm:items-center sm:gap-4">
        <p className="flex-1 text-sm leading-6 text-text-secondary">
          We use cookies to remember your preferences. No advertising, no tracking.{" "}
          <Link href="/privacy" className="font-semibold text-forest underline">
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={decline}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-text-secondary"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-deep"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
