"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CONSENT_KEY = "openair-cookie-consent";
const CONSENT_EVENT = "openair:cookie-consent-changed";
const GA_MEASUREMENT_ID = "G-DSQJZ4DR81";
const META_PIXEL_ID = "1123916308591546";

type FbqArgs = [command: string, ...args: unknown[]];
type FbqFunction = ((...args: FbqArgs) => void) & {
  callMethod?: (...args: FbqArgs) => void;
  loaded?: boolean;
  push?: (...args: FbqArgs) => void;
  queue?: FbqArgs[];
  version?: string;
};

declare global {
  interface Window {
    _fbq?: FbqFunction;
    dataLayer?: unknown[][];
    fbq?: FbqFunction;
    gtag?: (...args: unknown[]) => void;
  }
}

function initializeGoogleAnalytics() {
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }

  if (!document.getElementById("google-analytics-script")) {
    const script = document.createElement("script");
    script.id = "google-analytics-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

function initializeMetaPixel() {
  if (!window.fbq) {
    const fbq: FbqFunction = ((...args: FbqArgs) => {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
        return;
      }

      fbq.queue = fbq.queue || [];
      fbq.queue.push(args);
    }) as FbqFunction;

    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    fbq.push = (...args: FbqArgs) => {
      fbq(...args);
    };

    window.fbq = fbq;
    window._fbq = fbq;
  }

  if (!document.getElementById("meta-pixel-script")) {
    const script = document.createElement("script");
    script.id = "meta-pixel-script";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq("init", META_PIXEL_ID);
}

export function AnalyticsScripts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      setHasConsent(window.localStorage.getItem(CONSENT_KEY) === "accepted");
    };

    syncConsent();
    window.addEventListener("storage", syncConsent);
    window.addEventListener(CONSENT_EVENT, syncConsent as EventListener);

    return () => {
      window.removeEventListener("storage", syncConsent);
      window.removeEventListener(CONSENT_EVENT, syncConsent as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!hasConsent) {
      return;
    }

    initializeGoogleAnalytics();
    initializeMetaPixel();
  }, [hasConsent]);

  useEffect(() => {
    if (!hasConsent) {
      return;
    }

    const currentPath = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // App Router navigation keeps the same document alive, so page views
    // need to be re-fired when the URL changes.
    window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: currentPath });
    window.fbq?.("track", "PageView");
  }, [hasConsent, pathname, searchParams]);

  return null;
}
