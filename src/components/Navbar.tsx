"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useWishlist } from "./WishlistContext";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/quiz", label: "智能匹配" },
  { href: "/personality", label: "人格测试" },
  { href: "/clubs", label: "探索社团" },
  { href: "/my-applications", label: "我的报名" },
  { href: "/admin", label: "管理后台" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { wishlist } = useWishlist();

  return (
    <nav className="bg-white border-b border-[#eee]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center font-bold text-xl hover:scale-105 active:scale-95 transition-transform">
          <Image src="/images/logo-text.png" alt="社搭" width={320} height={160} className="h-24 w-auto object-contain" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-110 active:scale-95 ${
                pathname === link.href
                  ? "text-[#2B7DE9] bg-[#2B7DE9]/10"
                  : "text-[#555] hover:text-[#2B7DE9] hover:bg-[#2B7DE9]/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {wishlist.length > 0 && (
            <span className="text-xs bg-[var(--pink)] text-white px-2 py-0.5 rounded-full">
              意向 {wishlist.length}
            </span>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-[var(--text-light)]" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/60 bg-white/90 backdrop-blur-xl px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium ${
                pathname === link.href ? "text-[var(--pink-deep)]" : "text-[var(--text-light)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
