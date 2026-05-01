import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenAir Atlantic",
    short_name: "OpenAir",
    description: "Real-time environmental intelligence for Prince Edward Island.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: "#2D6E24",
    icons: [
      {
        src: "/openair-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/openair-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
