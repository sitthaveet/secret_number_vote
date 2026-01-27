"use client";

import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  activePage: "home" | "leaderboard" | "verify";
}

export default function Navbar({ activePage }: NavbarProps) {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[#2a2a40] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-[#ff6b35]/30">
            <Image
              src="/logo_people_party.jpeg"
              alt="People's Party Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-[family-name:var(--font-kanit)] text-xl font-bold text-white">
            ทาย<span className="text-[#ff6b35]">ที่นั่ง</span>
          </span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-2">
          <Link
            href="/leaderboard"
            className={`rounded-xl px-6 py-3 font-[family-name:var(--font-kanit)] text-lg font-medium transition-all duration-200 ${
              activePage === "leaderboard"
                ? "bg-[#ff6b35]/10 text-[#ff6b35]"
                : "text-white hover:bg-[#ff6b35]/10 hover:text-[#ff6b35]"
            }`}
          >
            ผลการเลือก
          </Link>
          {/* <Link
            href="/verify"
            className={`rounded-xl px-6 py-3 font-[family-name:var(--font-kanit)] text-lg font-medium transition-all duration-200 ${
              activePage === "verify"
                ? "bg-[#ff6b35]/10 text-[#ff6b35]"
                : "text-white hover:bg-[#ff6b35]/10 hover:text-[#ff6b35]"
            }`}
          >
            ตรวจสอบรหัส
          </Link> */}
        </div>
      </div>
    </nav>
  );
}
