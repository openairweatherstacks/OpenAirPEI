"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "openair-install-dismissed-v1";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    // Detect iOS Safari (no beforeinstallprompt — needs manual share flow)
    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as { standalone?: boolean }).standalone;

    if (ios) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 inset-x-4 z-[998] rounded-2xl bg-forest-deep p-5 shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-white">Add OpenAir to your home screen</p>
          {isIOS ? (
            <p className="mt-1.5 text-sm leading-6 text-white/80">
              Tap the <span className="font-semibold text-white">Share</span> button at the bottom of Safari, then tap{" "}
              <span className="font-semibold text-white">Add to Home Screen</span>.
            </p>
          ) : (
            <p className="mt-1.5 text-sm leading-6 text-white/80">
              Get quick access to live island conditions — one tap from your home screen.
            </p>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!isIOS && (
        <button
          onClick={install}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sun px-4 py-3 text-sm font-bold text-[#2a2a2a] transition hover:bg-sun-deep"
        >
          <Download className="h-4 w-4" />
          Install app
        </button>
      )}
    </div>
  );
}
