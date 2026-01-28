"use client";

import { useState, useEffect } from "react";

// Force dynamic rendering to prevent prerendering errors on Vercel
export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";
import { PARTY_LIST_MEMBERS } from "@/lib/constants";
import { otpDecrypt } from "@/lib/crypto";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

const USER_NAMES = [
  "Karn",
  "Petch",
  "Jern",
  "Tae",
  "Proud",
  "Praew",
  "Mild",
  "Son",
];

interface UserData {
  name: string;
  hash: string | null;
  salt: string | null;
  securityOption: boolean | null;
}

export default function VerifyPage() {
  const [selectedName, setSelectedName] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [fetchedHash, setFetchedHash] = useState("");
  const [fetchedSalt, setFetchedSalt] = useState("");
  const [fetchedSecurityOption, setFetchedSecurityOption] = useState(false);
  const [extraKeyNumber, setExtraKeyNumber] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    number?: number;
    message: string;
  } | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  // Fetch all users on mount
  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsFetching(true);
      try {
        const { data, error } = await supabase
          .from("user")
          .select("name, hash, salt, securityOption");

        if (error) {
          console.error("Error fetching users:", error);
          setAllUsers([]);
        } else {
          setAllUsers(data || []);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setAllUsers([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAllUsers();
  }, []);

  const handleNameSelect = (name: string) => {
    setSelectedName(name);
    setResult(null);
    setFetchedHash("");
    setFetchedSalt("");
    setFetchedSecurityOption(false);
    setExtraKeyNumber("");

    if (!name) return;

    // Find user in already-fetched data
    const userData = allUsers.find((user) => user.name === name);

    if (!userData) {
      setResult({
        success: false,
        message: "ไม่พบข้อมูลของผู้ใช้นี้ในระบบ",
      });
    } else if (userData.hash && userData.salt) {
      setFetchedHash(userData.hash);
      setFetchedSalt(userData.salt);
      setFetchedSecurityOption(userData.securityOption || false);
    } else {
      setResult({
        success: false,
        message: "ผู้ใช้นี้ยังไม่ได้ทายเลข",
      });
    }
  };

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fetchedHash && fetchedSalt && selectedMember) {
      // Check if security option is on but number is not provided
      if (fetchedSecurityOption && !extraKeyNumber) {
        setResult({
          success: false,
          message: "กรุณากรอกจำนวนที่นั่ง ส.ส. ที่คุณทายไว้",
        });
        return;
      }

      setIsDecrypting(true);

      setTimeout(async () => {
        const decrypted = await otpDecrypt(
          fetchedHash.toLowerCase(),
          selectedMember,
          fetchedSalt.toLowerCase(),
          fetchedSecurityOption ? extraKeyNumber : undefined,
        );
        if (decrypted !== null) {
          if (decrypted >= 0 && decrypted <= 500) {
            setResult({
              success: true,
              number: decrypted,
              message: `ผลการทาย: ${decrypted} ที่นั่ง`,
            });
          } else {
            setResult({
              success: false,
              message: "เลือกข้อมูลผิด",
            });
          }
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
      <Navbar activePage="verify" />

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
            เลือกชื่อของคุณและเลือกผู้สมัครที่คุณใช้ตอนทาย
            <br />
            เพื่อดูจำนวนที่นั่งที่คุณทายไว้
          </p>
        </div>

        {/* Form card */}
        <div className="animate-fade-in-up-delay-1 w-full max-w-xl">
          <div className="relative rounded-3xl border border-[#2a2a40] bg-[#141420]/80 p-10 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleDecrypt} className="space-y-8">
              {/* User name select */}
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
                  เลือกชื่อของคุณ
                </label>
                <div className="relative">
                  <select
                    value={selectedName}
                    onChange={(e) => handleNameSelect(e.target.value)}
                    disabled={isFetching}
                    className="h-20 w-full cursor-pointer appearance-none rounded-2xl border border-[#2a2a40] bg-[#1a1a2e] px-6 pr-14 font-[family-name:var(--font-kanit)] text-xl text-white transition-all duration-200 hover:border-[#ff6b35]/50 focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">— กรุณาเลือกชื่อ —</option>
                    {USER_NAMES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-[#ff6b35]">
                    {isFetching ? (
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
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>

              {/* Display hash if available */}
              {fetchedHash && (
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
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    รหัสที่เข้ารหัส
                  </label>
                  <div className="rounded-2xl border border-[#2a2a40] bg-[#1a1a2e] px-6 py-6">
                    <p className="break-all font-[family-name:var(--font-space-mono)] text-2xl font-bold tracking-wider text-[#ff6b35]">
                      {fetchedHash}
                    </p>
                  </div>
                </div>
              )}

              {/* Extra security number input - only show if securityOption is true */}
              {fetchedSecurityOption && fetchedHash && (
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
                    จำนวนที่นั่ง ส.ส. ที่คุณทายไว้
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={extraKeyNumber}
                      onChange={(e) => setExtraKeyNumber(e.target.value)}
                      placeholder="0 - 500"
                      min="0"
                      max="500"
                      className="h-20 w-full rounded-2xl border border-[#2a2a40] bg-[#1a1a2e] px-6 font-[family-name:var(--font-space-mono)] text-4xl font-bold tracking-wider text-[#ff6b35] placeholder-[#4a4a60] transition-all duration-200 hover:border-[#ff6b35]/50 focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/20"
                    />
                    <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-lg text-[#4a4a60]">
                      ที่นั่ง
                    </div>
                  </div>
                  <p className="text-sm text-[#8888a0]">
                    คุณเปิดใช้งานความปลอดภัยเพิ่มเติม
                    กรุณากรอกจำนวนที่นั่งที่คุณทายไว้
                  </p>
                </div>
              )}

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
                  !fetchedHash ||
                  !fetchedSalt ||
                  !selectedMember ||
                  isDecrypting ||
                  isFetching
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
