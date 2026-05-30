import type { Metadata } from "next";
import { VT323, Inter } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DigiSketch",
  description: "Create tiny pixel notes and share them with a single link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${vt323.variable} ${inter.variable} h-full antialiased`}>
      <body className="text-ink">
        <main className="max-w-md mx-auto w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
