"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PARTY_LIST_MEMBERS } from "@/lib/constants";
import { otpEncrypt } from "@/lib/crypto";
import { supabase } from "@/lib/supabase";

const NAMES = ["Karn", "Petch", "Jern", "Tae", "Proud", "Mild", "Son"];

export default function Home() {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (number && selectedName && selectedMember) {
      setIsSubmitting(true);
      const encrypted = otpEncrypt(parseInt(number), selectedMember);

      try {
        // Check if name already exists
        const { data: existingUser } = await supabase
          .from("user")
          .select("*")
          .eq("name", selectedName)
          .single();

        let result;
        if (existingUser) {
          // Update existing user
          result = await supabase
            .from("user")
            .update({ hash: encrypted })
            .eq("name", selectedName);
        } else {
          // Insert new user
          result = await supabase
            .from("user")
            .insert({ name: selectedName, hash: encrypted });
        }

        if (result.error) {
          console.error("Error saving to database:", result.error);
          console.error("Error details:", {
            message: result.error.message,
            details: result.error.details,
            hint: result.error.hint,
            code: result.error.code,
          });
          // Still show the ciphertext even if database save fails
        } else {
          console.log("Successfully saved/updated in database:", result.data);
        }

        setTimeout(() => {
          setCiphertext(encrypted);
          setIsSubmitting(false);
          // Redirect to leaderboard after showing the ciphertext
          setTimeout(() => {
            router.push("/leaderboard");
          }, 2000);
        }, 300);
      } catch (err) {
        console.error("Unexpected error:", err);
        setTimeout(() => {
          setCiphertext(encrypted);
          setIsSubmitting(false);
          // Redirect to leaderboard after showing the ciphertext
          setTimeout(() => {
            router.push("/leaderboard");
          }, 2000);
        }, 300);
      }
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
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-[#ff6b35]/30 shadow-lg shadow-[#ff6b35]/20 md:h-40 md:w-40">
              <Image
                src="/logo_people_party.jpeg"
                alt="People's Party Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/10 px-6 py-3 text-lg font-medium text-[#ff6b35]">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff6b35] opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#ff6b35]"></span>
            </span>
            การเลือกตั้ง 2569
          </div>

          <h1 className="mb-4 font-[family-name:var(--font-kanit)] text-6xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
            ทาย<span className="text-[#ff6b35]">ที่นั่ง</span>
          </h1>
          <h2 className="font-[family-name:var(--font-kanit)] text-3xl font-medium text-white/80 md:text-4xl">
            พรรคประชาชน
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-xl text-[#8888a0]">
            ทายจำนวนที่นั่ง ส.ส. และเลือกผู้สมัครที่คุณชื่นชอบ
            <br />
            ระบบจะสร้างรหัสยืนยันการทายของคุณ
          </p>
        </div>

        {/* Form card */}
        <div className="animate-fade-in-up-delay-1 w-full max-w-xl">
          <div className="relative rounded-3xl border border-[#2a2a40] bg-[#141420]/80 p-10 shadow-2xl backdrop-blur-xl">
            {/* Card glow effect */}
            <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-[#ff6b35]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Number input */}
              <div className="space-y-3">
                {/* Name select */}
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
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    ชื่อของคุณ
                  </label>
                  <div className="relative">
                    <select
                      value={selectedName}
                      onChange={(e) => setSelectedName(e.target.value)}
                      className="h-20 w-full cursor-pointer appearance-none rounded-2xl border border-[#2a2a40] bg-[#1a1a2e] px-6 pr-14 font-[family-name:var(--font-kanit)] text-xl text-white transition-all duration-200 hover:border-[#ff6b35]/50 focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/20"
                    >
                      <option value="">— กรุณาเลือกชื่อ —</option>
                      {NAMES.map((name, index) => (
                        <option key={index} value={name}>
                          {name}
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
                <label className="my-4 flex items-center gap-3 text-lg font-medium text-white/70">
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
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  ทายจำนวนที่นั่ง ส.ส.
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="0 - 500"
                    min="0"
                    max="500"
                    className="h-20 w-full rounded-2xl border border-[#2a2a40] bg-[#1a1a2e] px-6 font-[family-name:var(--font-space-mono)] text-4xl font-bold tracking-wider text-[#ff6b35] placeholder-[#4a4a60] transition-all duration-200 hover:border-[#ff6b35]/50 focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/20"
                  />
                  <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-lg text-[#4a4a60]">
                    ที่นั่ง
                  </div>
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
                  เลือกผู้สมัครที่คุณชื่นชอบ
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
                  !number || !selectedName || !selectedMember || isSubmitting
                }
                className="group relative h-20 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] font-[family-name:var(--font-kanit)] text-2xl font-semibold text-white shadow-lg shadow-[#ff6b35]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff6b35]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
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
                      กำลังสร้างรหัส...
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      ยืนยัน
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </form>

            {/* Ciphertext result */}
            {ciphertext && (
              <div className="animate-hash-reveal mt-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3 text-lg font-medium text-white/70">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    รหัสยืนยัน
                  </span>
                </div>
                <div className="animate-pulse-glow relative overflow-hidden rounded-2xl border border-[#ff6b35]/30 bg-[#0a0a0f] p-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/5 to-transparent" />
                  <p className="relative break-all font-[family-name:var(--font-space-mono)] text-4xl leading-relaxed tracking-widest text-[#ff8c5a] text-center">
                    {ciphertext}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="animate-fade-in-up-delay-2 mt-10 text-center">
          <p className="text-lg text-[#8888a0]">
            รหัสลับถูกสร้างจากการรวม จำนวนที่ทาย + ชื่อผู้สมัคร
          </p>
        </div>
      </div>
    </div>
  );
}
