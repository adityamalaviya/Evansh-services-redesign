import '@/lib/env';
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Evansh Services - learn today, build tomorrow",
  description: "Expert IT Training, Practical Knowledge and Understanding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth antialiased ${plusJakartaSans.variable}`}>
      <body className={`${plusJakartaSans.className} min-h-full bg-[#F8FAFC] text-[#1E293B] overflow-x-hidden antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
