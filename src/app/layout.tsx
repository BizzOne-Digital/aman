import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Canam Facility Services Ltd | Keeping Fleet & Facility Clean",
    template: "%s | Canam Facility Services",
  },
  description: "Professional fleet, commercial facility, and residential cleaning with flexible service plans across Canada.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Canam Facility Services Ltd",
    title: "Keeping Fleet & Facility Clean",
    description: "Flexible professional cleaning for fleets, facilities, and homes across Canada.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Canam Facility Services Ltd",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    email: "info@canamfacility.ca",
    telephone: "+15874330000",
    areaServed: { "@type": "Country", name: "Canada" },
    description: "Fleet, commercial facility, and residential cleaning across Canada.",
  };
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a className="sr-only" href="#main-content">Skip to main content</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
