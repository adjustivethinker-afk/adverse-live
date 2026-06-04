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
    default: "AdVerse Live — Earn. Connect. Grow.",
    template: "%s · AdVerse Live",
  },
  description:
    "Pakistan's simple earning app. Solve a daily quiz, build a 3-level referral team, chat with friends, and earn halal income.",
  keywords: [
    "AdVerse Live",
    "earning app Pakistan",
    "daily quiz reward",
    "referral team",
    "Pakistan earning",
    "halal earning",
  ],
  applicationName: "AdVerse Live",
  authors: [{ name: "AdVerse Live" }],
  category: "social",
  openGraph: {
    title: "AdVerse Live — Earn. Connect. Grow.",
    description:
      "Daily quiz reward, 3-level referral team, and personal chat — built for Pakistani users.",
    type: "website",
    locale: "en_PK",
    siteName: "AdVerse Live",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdVerse Live",
    description:
      "Daily quiz, 3-level referral team — Pakistan's simple earning app.",
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
