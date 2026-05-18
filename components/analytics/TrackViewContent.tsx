"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Props {
  contentName: string;
  locationSlug?: string;
  score?: string;
}

export function TrackViewContent({ contentName, locationSlug, score }: Props) {
  const { trackViewContent } = useAnalytics();

  useEffect(() => {
    trackViewContent(contentName, locationSlug, score);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
