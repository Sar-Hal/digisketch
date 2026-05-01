import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
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
    <html lang="en" className={`${vt323.variable} h-full antialiased`}>
      <body className="bg-[#FDFBF7] text-ink">
        <main className="max-w-[420px] mx-auto w-full min-h-screen px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
