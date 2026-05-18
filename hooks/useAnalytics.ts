"use client";

import { useCallback } from "react";
import { pushEvent, mirrorToCapiAsync, type AnalyticsEvent } from "@/lib/analytics";

export function useAnalytics() {
  const track = useCallback(
    (ev: AnalyticsEvent, mirrorCapi = false) => {
      pushEvent(ev);
      if (mirrorCapi && "content_name" in ev) {
        mirrorToCapiAsync(ev.event, ev as Record<string, string | number | boolean>);
      }
    },
    []
  );

  const trackViewContent = useCallback(
    (contentName: string, locationSlug?: string, score?: string) => {
      track(
        {
          event: "view_content",
          content_type: "location",
          content_name: contentName,
          location_slug: locationSlug,
          score,
        },
        true
      );
    },
    [track]
  );

  const trackConditionsChecked = useCallback(
    (locationSlug: string, score: string, locationType: string) => {
      track(
        {
          event: "conditions_checked",
          location_slug: locationSlug,
          score,
          location_type: locationType,
        },
        true
      );
    },
    [track]
  );

  const trackPwaInstalled = useCallback(() => {
    track({ event: "pwa_installed" }, true);
  }, [track]);

  const trackPwaPromptShown = useCallback(() => {
    track({ event: "pwa_install_prompt_shown" });
  }, [track]);

  const trackShare = useCallback(
    (locationSlug: string, method: string) => {
      track({ event: "share_clicked", location_slug: locationSlug, method });
    },
    [track]
  );

  return {
    track,
    trackViewContent,
    trackConditionsChecked,
    trackPwaInstalled,
    trackPwaPromptShown,
    trackShare,
  };
}
