import type { MetadataRoute } from "next";

import { PEI_LOCATIONS } from "@/lib/data/locations";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/explore", changeFrequency: "daily", priority: 0.9 },
    { path: "/activity", changeFrequency: "daily", priority: 0.9 },
    { path: "/bridge", changeFrequency: "daily", priority: 0.9 },
    { path: "/air", changeFrequency: "daily", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/data-sources", changeFrequency: "monthly", priority: 0.6 },
    { path: "/accessibility", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/report", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  const locationRoutes = PEI_LOCATIONS.map((location) => ({
    url: `${siteUrl}/location/${location.id}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...locationRoutes,
  ];
}
