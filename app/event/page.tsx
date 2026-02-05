"use client";

// Force dynamic rendering to prevent prerendering errors on Vercel
export const dynamic = "force-dynamic";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function EventPage() {
  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=%F0%9F%8D%8A%20Dinner&dates=20260301T180000/20260301T210000&ctz=Asia/Bangkok&location=Slay%20Yuan%20Dusit%20Central%20Park&details=Celebrate%20and%20see%20who%20is%20the%20winner%20of%20the%20game.%20Map:%20https%3A%2F%2Fmaps.app.goo.gl%2FcFqvXaPuK961g1Gn9";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Navigation bar */}
      <Navbar activePage="event" />

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
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="animate-fade-in-up mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/10 px-6 py-3 text-lg font-medium text-[#ff6b35]">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Event
            </div>

            <h1 className="mb-4 font-[family-name:var(--font-kanit)] text-5xl font-bold tracking-tight text-white md:text-6xl">
              งานฉลอง<span className="text-[#ff6b35]">ผู้ชนะ</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-[#8888a0]">
              มาร่วมเฉลิมฉลองและดูว่าใครคือผู้ชนะเกมทายจำนวนที่นั่ง
            </p>
          </div>

          {/* Event card */}
          <div className="animate-fade-in-up group relative overflow-hidden rounded-3xl border border-[#2a2a40] bg-[#141420]/80 p-10 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-[#ff6b35]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative space-y-8">
              <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-[#2a2a40] md:h-72">
                <Image
                  src="/slayyuan_cover.jpg"
                  alt="Slay Yuan Dusit Central Park"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="space-y-2">
                <p className="text-lg font-medium text-[#ff6b35]">รายละเอียดงาน</p>
                <h2 className="font-[family-name:var(--font-kanit)] text-3xl font-semibold text-white">
                  เฉลยผลลัพธ์เกมทายที่นั่ง สส พรรคประชาชน
                </h2>
                <p className="text-lg text-[#8888a0]">
                  เฉลิมฉลองและประกาศผู้ชนะเกมทายจำนวนที่นั่งของพรรคประชาชน
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-[#2a2a40] bg-[#0f0f18] p-5">
                  <p className="text-sm text-[#8888a0]">Date</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    1 March 2026
                  </p>
                </div>
                <div className="rounded-2xl border border-[#2a2a40] bg-[#0f0f18] p-5">
                  <p className="text-sm text-[#8888a0]">Time</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    18:00 - 21:00 (Bangkok)
                  </p>
                </div>
                <div className="rounded-2xl border border-[#2a2a40] bg-[#0f0f18] p-5">
                  <p className="text-sm text-[#8888a0]">Location</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Slay Yuan Dusit Central Park
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-[#ff6b35] px-6 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#ff6b35]/90"
                >
                  Add to Google Calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
