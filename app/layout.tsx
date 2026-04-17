import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import type { ReactNode } from "react";
import "leaflet/dist/leaflet.css";

import { BottomNav } from "@/components/layout/BottomNav";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "OpenAir PEI",
    template: "%s | OpenAir PEI",
  },
  description:
    "Real-time environmental intelligence for Prince Edward Island. OpenAir PEI turns island conditions into confident outdoor decisions.",
  applicationName: "OpenAir PEI",
  icons: {
    icon: "/openair-logo.png",
    apple: "/openair-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafaf7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`}>
        <div className="min-h-screen">
          <Header />
          <main className="pb-28 md:pb-12">{children}</main>
          <Footer />
          <BottomNav />
          <CookieBanner />
        </div>
      </body>
    </html>
  );
}
