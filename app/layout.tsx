import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import { type ReactNode } from "react";
import "leaflet/dist/leaflet.css";

import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { BetaBanner } from "@/components/layout/BetaBanner";
import { BottomNav } from "@/components/layout/BottomNav";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { InstallPrompt } from "@/components/layout/InstallPrompt";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: ["400"],
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
      <head>
        {/* Consent Mode v2 — must run before GTM loads */}
        <Script id="gtm-consent-default" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
          var consent = null;
          try { consent = localStorage.getItem('openair-cookie-consent'); } catch(e) {}
          if (consent === 'accepted') {
            gtag('consent', 'update', {
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
              analytics_storage: 'granted'
            });
          }
        `}</Script>
        <Script id="gtm-init" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-P6VC9SNZ');
        `}</Script>
      </head>
      <body className={`${dmSans.variable} ${dmSerifDisplay.variable} font-sans antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6VC9SNZ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div className="min-h-screen">
          <SiteJsonLd />
          <BetaBanner />
          <Header />
          <main className="pb-28 md:pb-12">{children}</main>
          <Footer />
          <BottomNav />
          <InstallPrompt />
          <CookieBanner />
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
