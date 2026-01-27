"use client";

import { useState, useEffect } from "react";

// Force dynamic rendering to prevent prerendering errors on Vercel
export const dynamic = 'force-dynamic';
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

interface User {
  name: string;
  hash: string | null;
  salt: string | null;
  created_at: string;
}

// Map names to their profile picture filenames
const PROFILE_PICS: Record<string, string> = {
  Karn: "karn.png",
  Petch: "petch.png",
  Jern: "jern.png",
  Tae: "tae.png",
  Proud: "proud.png",
  Mild: "mild.png",
  Son: "son.png",
};

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("name, hash, salt, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Navigation bar */}
      <Navbar activePage="leaderboard" />

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
      <div className="relative min-h-screen px-8 py-20 pt-36">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="animate-fade-in-up mb-16 text-center">
            <div className="mb-8 inline-flex items-center gap-4 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/10 px-8 py-4 text-xl font-medium text-[#ff6b35]">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              การเลือกตั้ง 2569
            </div>

            <h1 className="mb-6 font-[family-name:var(--font-kanit)] text-6xl font-bold tracking-tight text-white md:text-7xl">
              ผลการเลือกของ<span className="text-[#ff6b35]">พวกเรา</span>
            </h1>
            <p className="mx-auto max-w-lg text-2xl text-[#8888a0]">
              รายชื่อผู้ทายจำนวนที่นั่ง ส.ส. ทั้งหมด
            </p>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-6">
                <svg
                  className="h-16 w-16 animate-spin text-[#ff6b35]"
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
                <p className="font-[family-name:var(--font-kanit)] text-2xl text-[#8888a0]">
                  กำลังโหลดข้อมูล...
                </p>
              </div>
            </div>
          )}

          {/* Users list */}
          {!isLoading && users.length === 0 && (
            <div className="animate-fade-in-up py-24 text-center">
              <div className="mb-8 flex justify-center">
                <div className="rounded-full bg-[#ff6b35]/10 p-8">
                  <svg
                    className="h-20 w-20 text-[#ff6b35]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
              </div>
              <p className="font-[family-name:var(--font-kanit)] text-3xl text-white">
                ยังไม่มีข้อมูล
              </p>
              <p className="mt-3 text-xl text-[#8888a0]">
                กลับไปหน้าแรกเพื่อทายจำนวนที่นั่ง
              </p>
            </div>
          )}

          {!isLoading && users.length > 0 && (
            <div className="animate-fade-in-up grid gap-8 md:grid-cols-2">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-[#2a2a40] bg-[#141420]/80 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#ff6b35]/50 hover:shadow-2xl hover:shadow-[#ff6b35]/10"
                >
                  {/* Card glow effect */}
                  <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-[#ff6b35]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex items-center gap-8">
                    {/* Profile picture */}
                    <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-[#ff6b35]/30 shadow-lg shadow-[#ff6b35]/20 transition-all duration-300 group-hover:border-[#ff6b35]/50 group-hover:shadow-xl group-hover:shadow-[#ff6b35]/30">
                      {PROFILE_PICS[user.name] ? (
                        <Image
                          src={`/userProfile/${PROFILE_PICS[user.name]}`}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#ff6b35]/20 text-4xl font-bold text-[#ff6b35]">
                          {user.name[0]}
                        </div>
                      )}
                    </div>

                    {/* User info */}
                    <div className="flex-1 overflow-hidden">
                      <h3 className="mb-4 font-[family-name:var(--font-kanit)] text-3xl font-bold text-white">
                        {user.name}
                      </h3>

                      {user.hash && user.salt ? (
                        <div className="space-y-3">
                          <div className="overflow-hidden rounded-xl border border-[#ff6b35]/20 bg-[#0a0a0f] p-4">
                            <p className="break-all font-[family-name:var(--font-space-mono)] text-xl leading-relaxed tracking-wide text-[#ff8c5a]">
                              {user.hash}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-base text-[#8888a0]">
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
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          ยังไม่ได้ทาย
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
