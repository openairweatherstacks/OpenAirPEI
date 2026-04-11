import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenAir PEI",
    short_name: "OpenAir",
    description: "Real-time environmental intelligence for Prince Edward Island.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: "#3a8c2f",
    icons: [
      {
        src: "/openair-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
