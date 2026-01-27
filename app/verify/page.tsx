"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PARTY_LIST_MEMBERS } from "@/lib/constants";
import { otpDecrypt } from "@/lib/crypto";

export default function VerifyPage() {
  const [ciphertext, setCiphertext] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    number?: number;
    message: string;
  } | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (ciphertext && selectedMember) {
      setIsDecrypting(true);
      setTimeout(() => {
        const decrypted = otpDecrypt(ciphertext.toLowerCase(), selectedMember);
        if (decrypted !== null) {
          setResult({
            success: true,
            number: decrypted,
            message: `ผลการทาย: ${decrypted} ที่นั่ง`,
          });
        } else {
          setResult({
            success: false,
            message: "รหัสไม่ถูกต้อง หรือเลือกผู้สมัครผิดคน",
          });
        }
        setIsDecrypting(false);
      }, 300);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Navigation bar */}
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
              href="/"
              className="rounded-xl px-6 py-3 font-[family-name:var(--font-kanit)] text-lg font-medium text-white transition-all duration-200 hover:bg-[#ff6b35]/10 hover:text-[#ff6b35]"
            >
              หน้าหลัก
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-xl px-6 py-3 font-[family-name:var(--font-kanit)] text-lg font-medium text-white transition-all duration-200 hover:bg-[#ff6b35]/10 hover:text-[#ff6b35]"
            >
              ผลการเลือก
            </Link>
          </div>
        </div>
      </nav>

      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#ff6b35]/20 blur-[128px]" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#ff6b35]/10 blur-[128px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(#ff6b35 1px, transparent 1px),
              linear-gradient(90deg, #ff6b35 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Diagonal lines accent */}
        <div
          className="absolute right-0 top-0 h-full w-1/3 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #ff6b35,
              #ff6b35 1px,
              transparent 1px,
              transparent 20px
            )`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 pt-32">
        {/* Header section */}
        <div className="animate-fade-in-up mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/10 px-6 py-3 text-lg font-medium text-[#ff6b35]">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            ตรวจสอบรหัส
          </div>

          <h1 className="mb-4 font-[family-name:var(--font-kanit)] text-5xl font-bold tracking-tight text-white md:text-6xl">
            ถอดรหัส<span className="text-[#ff6b35]">ยืนยัน</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-xl text-[#8888a0]">
            ใส่รหัสยืนยันและเลือกผู้สมัครที่คุณใช้ตอนทาย
            <br />
            เพื่อดูจำนวนที่นั่งที่คุณทายไว้
          </p>
        </div>

        {/* Form card */}
        <div className="animate-fade-in-up-delay-1 w-full max-w-xl">
          <div className="relative rounded-3xl border border-[#2a2a40] bg-[#141420]/80 p-10 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleDecrypt} className="space-y-8">
              {/* Ciphertext input */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-lg font-medium text-white/70">
                  <svg
                    className="h-6 w-6 text-[#ff6b35]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  รหัสยืนยัน (6 ตัวอักษร)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ciphertext}
                    onChange={(e) =>
                      setCiphertext(e.target.value.slice(0, 6).toLowerCase())
                    }
                    placeholder="abc123"
                    maxLength={6}
                    className="h-20 w-full rounded-2xl border border-[#2a2a40] bg-[#1a1a2e] px-6 font-[family-name:var(--font-space-mono)] text-4xl font-bold tracking-widest text-[#ff6b35] placeholder-[#4a4a60] transition-all duration-200 hover:border-[#ff6b35]/50 focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/20 text-center uppercase"
                  />
                </div>
              </div>

              {/* Member select */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-lg font-medium text-white/70">
                  <svg
                    className="h-6 w-6 text-[#ff6b35]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  เลือกผู้สมัครที่ใช้ตอนทาย
                </label>
                <div className="relative">
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="h-20 w-full cursor-pointer appearance-none rounded-2xl border border-[#2a2a40] bg-[#1a1a2e] px-6 pr-14 font-[family-name:var(--font-kanit)] text-xl text-white transition-all duration-200 hover:border-[#ff6b35]/50 focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/20"
                  >
                    <option value="">— กรุณาเลือกผู้สมัคร —</option>
                    {PARTY_LIST_MEMBERS.map((member, index) => (
                      <option key={index} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-[#ff6b35]">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={
                  ciphertext.length !== 6 || !selectedMember || isDecrypting
                }
                className="group relative h-20 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] font-[family-name:var(--font-kanit)] text-2xl font-semibold text-white shadow-lg shadow-[#ff6b35]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff6b35]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isDecrypting ? (
                    <>
                      <svg
                        className="h-7 w-7 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      กำลังถอดรหัส...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                      ถอดรหัส
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </form>

            {/* Result */}
            {result && (
              <div className="animate-hash-reveal mt-10 space-y-4">
                <div
                  className={`relative overflow-hidden rounded-2xl border p-8 ${
                    result.success
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-red-500/30 bg-red-500/10"
                  }`}
                >
                  <div className="flex items-center justify-center gap-4">
                    {result.success ? (
                      <svg
                        className="h-12 w-12 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-12 w-12 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    <div className="text-center">
                      {result.success && result.number !== undefined && (
                        <p className="font-[family-name:var(--font-space-mono)] text-6xl font-bold text-green-400">
                          {result.number}
                        </p>
                      )}
                      <p
                        className={`text-xl ${
                          result.success ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {result.success ? "ที่นั่ง" : result.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="animate-fade-in-up-delay-2 mt-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg text-[#8888a0] transition-colors hover:text-[#ff6b35]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            กลับไปหน้าทายที่นั่ง
          </Link>
        </div>
      </div>
    </div>
  );
}
