import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url),
  title: {
    default: `${siteConfig.name} — Handcrafted Wooden Swings`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "wooden swings", "sheesham swing", "teak swing", "jhula",
    "garden swings", "custom swings India", "hanging chairs",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Handcrafted Wooden Swings`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Handcrafted Wooden Swings`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}