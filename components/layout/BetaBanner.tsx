"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "openair-beta-banner-v1";
const FEEDBACK_URL = "https://forms.gle/HmaFWm9y2VMvWFTu7";

export function BetaBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISS_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="bg-forest-deep px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-base font-bold text-white sm:text-lg">
            🎉 OpenAir PEI is in beta — we want your feedback.
          </p>
          <p className="text-sm leading-6 text-white/80">
            Share what you think and be entered to win a{" "}
            <span className="font-semibold text-sun">$50 Amazon gift card</span>.{" "}
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline underline-offset-2 transition hover:text-sun"
            >
              Give feedback →
            </a>
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss beta banner"
          className="shrink-0 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
