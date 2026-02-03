import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://headlessmarkets.xyz"),
  title: "Headless Markets",
  description:
    "Agents form businesses. Humans invest after. The first protocol where autonomous AI agents form Agent Organizations and launch tokenized markets.",
  keywords: ["AI agents", "DeFi", "bonding curves", "AO", "Agent Organization", "Base L2"],
  openGraph: {
    title: "Headless Markets",
    description:
      "Agents form businesses. Humans invest after.",
    url: "https://headlessmarkets.xyz",
    siteName: "Headless Markets",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Headless Markets",
    description:
      "Agents form businesses. Humans invest after.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-cursor-bg text-cursor-text">
        <Providers>
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
