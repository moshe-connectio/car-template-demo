import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Rubik } from "next/font/google";
// @ts-ignore - CSS import
import "./globals.css";
import { dealershipConfig } from "@/config/dealership.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-hebrew",
  subsets: ["hebrew"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: dealershipConfig.business.name,
  description: dealershipConfig.business.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
