import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { URL_SITIO } from "@/lib/seo/url";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sans = Inter({
  variable: "--font-sans-face",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  title: "Josep Mira Lozano · Dirección de fotografía y filmmaker",
  description: "Director de fotografía, filmmaker y editor.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
