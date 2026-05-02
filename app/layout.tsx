import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Roboto } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import "leaflet/dist/leaflet.css";

import { BetaBanner } from "@/components/layout/BetaBanner";
import { BottomNav } from "@/components/layout/BottomNav";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSiteUrl } from "@/lib/site";

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
  title: {
    default: "OpenAir Atlantic",
    template: "%s | OpenAir Atlantic",
  },
  metadataBase: new URL(getSiteUrl()),
  description:
    "Real-time environmental intelligence for Prince Edward Island. OpenAir Atlantic turns island conditions into confident outdoor decisions.",
  applicationName: "OpenAir Atlantic",

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
          <BetaBanner />
          <Header />
          <main className="pb-28 md:pb-12">{children}</main>
          <Footer />
          <BottomNav />
          <CookieBanner />
        </div>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-DSQJZ4DR81" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DSQJZ4DR81');
        `}</Script>
      </body>
    </html>
  );
}
