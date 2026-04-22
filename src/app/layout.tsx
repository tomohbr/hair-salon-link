import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import PWARegister from "@/components/shared/PWARegister";
import Toaster from "@/components/shared/Toaster";
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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hair-salon-link-production.up.railway.app";
const TITLE = "HairSalonLink — 美容室のための、自社集客サービス";
const DESCRIPTION = "ホットペッパーで来店した新規のお客さまを、LINEのやさしいつながりで自社の常連さまへ。ハイトーン・髪質改善サロンから地域の個人美容室まで、月額 ¥4,980 から。";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: TITLE,
    template: "%s | HairSalonLink",
  },
  description: DESCRIPTION,
  applicationName: "HairSalonLink",
  keywords: [
    "美容室 予約システム", "ヘアサロン SaaS", "LINE 予約", "ホットペッパー 代替",
    "美容室 顧客管理", "サロン DX", "美容室 SaaS",
  ],
  authors: [{ name: "HairSalonLink" }],
  creator: "HairSalonLink",
  publisher: "HairSalonLink",
  manifest: "/manifest.webmanifest",
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HairSalonLink",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: APP_URL,
    siteName: "HairSalonLink",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "HairSalonLink" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: APP_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJp.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster>
          {children}
        </Toaster>
        <PWARegister />
      </body>
    </html>
  );
}
