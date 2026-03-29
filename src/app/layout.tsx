import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import { WishlistProvider } from "@/components/WishlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "社团招新智能匹配平台",
  description: "AI驱动的高校社团招新匹配系统，帮助新生快速找到最适合的社团",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist-sans)]">
        <WishlistProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="glass border-t py-8 text-center text-sm text-[#888]">
            <p>社团招新智能匹配平台 &copy; 2026 | AI Powered by Claude</p>
          </footer>
          <ChatWidget />
        </WishlistProvider>
      </body>
    </html>
  );
}
