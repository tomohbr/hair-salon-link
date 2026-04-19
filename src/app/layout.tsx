import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import PWARegister from "@/components/shared/PWARegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-serif-jp",
  weight: ["500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HairSalonLink — 美容室のための、自社集客サービス",
  description: "ホットペッパーでご来店いただいた新規のお客さまを、LINEのやさしいつながりで、自社の常連さまへ。月額 ¥4,980 の美容室特化 SaaS。",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HairSalonLink",
  },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1F5F80",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJp.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
