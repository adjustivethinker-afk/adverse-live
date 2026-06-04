import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuroraBackground } from "@/components/fx/aurora";
import { Toaster } from "sonner";
import { SessionBoot } from "@/components/app/session-boot";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://adverse.live";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AdVerse Live — Kamao. Bolo. Apne logon se milo.",
    template: "%s · AdVerse Live",
  },
  description:
    "Pakistan ki pehli premium earning + live voice rooms app. Roz aik aasaan quiz solve karein, 3-level referral team banayein, live voice rooms host karein, aur naye dost banayein.",
  keywords: [
    "AdVerse Live",
    "earning app Pakistan",
    "daily quiz reward",
    "voice rooms",
    "referral team",
    "Pakistan earning",
    "live audio chat",
  ],
  applicationName: "AdVerse Live",
  authors: [{ name: "AdVerse Live" }],
  category: "social",
  openGraph: {
    title: "AdVerse Live — Kamao. Bolo. Apne logon se milo.",
    description:
      "Roz aik quiz, 3-level referral team, live voice rooms aur personal chat — Pakistan ke liye banayi gayi premium app.",
    type: "website",
    locale: "en_PK",
    siteName: "AdVerse Live",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdVerse Live",
    description:
      "Roz aik quiz, 3-level referral team aur live voice rooms — Pakistan ke liye banayi gayi premium app.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#09090F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased text-white selection:bg-violet-500/40">
        <AuroraBackground />
        <SessionBoot />
        <div className="relative z-10">{children}</div>
        <Toaster
          position="top-center"
          theme="dark"
          richColors
          toastOptions={{
            classNames: {
              toast:
                "!bg-white/[0.06] !border-white/10 !backdrop-blur-2xl !text-white",
            },
          }}
        />
      </body>
    </html>
  );
}
