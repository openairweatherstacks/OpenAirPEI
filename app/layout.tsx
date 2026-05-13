import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Roboto } from "next/font/google";
import Script from "next/script";
import { Suspense, type ReactNode } from "react";
import "leaflet/dist/leaflet.css";

import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { BetaBanner } from "@/components/layout/BetaBanner";
import { BottomNav } from "@/components/layout/BottomNav";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { InstallPrompt } from "@/components/layout/InstallPrompt";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openairatlantic.com"),
  title: {
    default: "OpenAir Atlantic — Smart Weather for the Outdoors",
    template: "%s | OpenAir Atlantic",
  },
  description:
    "Real-time outdoor conditions for Prince Edward Island. Live weather, air quality, tides, and UV — translated into plain-English verdicts for 16 PEI locations.",
  applicationName: "OpenAir Atlantic",
  keywords: [
    "PEI weather",
    "Prince Edward Island weather",
    "Cavendish beach conditions",
    "PEI outdoor conditions",
    "should I go outside PEI",
    "PEI tide times",
    "Confederation Bridge wind",
    "PEI air quality",
    "openairatlantic",
  ],
  authors: [{ name: "OpenAir Atlantic", url: "https://openairatlantic.com" }],
  creator: "OpenAir Atlantic",
  publisher: "OpenAir Atlantic",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://openairatlantic.com",
    siteName: "OpenAir Atlantic",
    title: "OpenAir Atlantic — Smart Weather for the Outdoors",
    description: "Real-time outdoor conditions for Prince Edward Island. Should you go outside right now? We tell you.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "OpenAir Atlantic — Smart Weather for PEI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenAir Atlantic — Smart Weather for the Outdoors",
    description: "Real-time outdoor conditions for Prince Edward Island.",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "https://openairatlantic.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/openair-icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/openair-icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  verification: {
    google: "iymnYwJFYxMYT2yhI1kH8dS7Z8RB6df3Fo-SBNQxejg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2D6E24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${barlowCondensed.variable} font-sans antialiased`}>
        <div className="min-h-screen">
          <SiteJsonLd />
          <BetaBanner />
          <Header />
          <main className="pb-28 md:pb-12">{children}</main>
          <Footer />
          <BottomNav />
          <InstallPrompt />
          <CookieBanner />
          <Suspense fallback={null}>
            <AnalyticsScripts />
          </Suspense>
        </div>
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        `}</Script>
      </body>
    </html>
  );
}
