/**
 * dataLayer event definitions for GTM.
 * GTM routes these to GA4, Meta Pixel, and Google Ads.
 * Server-side events are mirrored to Meta CAPI via /api/meta-capi.
 */

export type AnalyticsEvent =
  | { event: "page_view"; page_path: string; page_title: string }
  | { event: "view_content"; content_type: string; content_name: string; location_slug?: string; score?: string }
  | { event: "pwa_install_prompt_shown" }
  | { event: "pwa_installed" }
  | { event: "conditions_checked"; location_slug: string; score: string; location_type: string }
  | { event: "share_clicked"; location_slug: string; method: string }
  | { event: "alert_subscribed"; location_slug?: string }
  | { event: "outbound_link"; url: string };

declare global {
  interface Window {
    dataLayer?: object[];
  }
}

export function pushEvent(ev: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(ev);
}

/** Mirror a browser event to Meta CAPI server-side for iOS/adblocker coverage. */
export async function mirrorToCapiAsync(
  eventName: string,
  customData?: Record<string, string | number | boolean>
) {
  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName, customData }),
    });
  } catch {
    // Non-critical — browser pixel is the fallback
  }
}
