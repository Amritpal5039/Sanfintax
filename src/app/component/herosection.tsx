"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden  text-white pt-30 pb-6">
      <div className="absolute inset-0">
        <Image
          src="/investment.webp"
          alt="Background Image"
          fill
          className="object-cover brightness-60"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(175deg,_rgba(255,255,255,1)_11%,_rgba(255,255,255,0)_48%,_rgba(0,0,0,1)_84%)]" />
      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-6">
        {/* Badge */}
        <span className="text-xs font-semibold tracking-widest uppercase text-red-200 border border-red-800 px-4 py-1 rounded-full bg-red-950/30">
          Personal Finance Dashboard
        </span>

        {/* Headline */}
        <h1
          className="text-5xl md:text-5xl font-bold text-white leading-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Sanfintax brings clarity to your money — so you plan better, save
          smarter, and grow faster.
        </h1>

        {/* Subheadline */}
        <p
          className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Track your FDs, manage liabilities, and set financial goals — all in
          one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button
            onClick={() => router.push("/Pages/Login")}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-all duration-200 text-sm tracking-wide"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Get Started
          </button>
          <button
            onClick={() => router.push("/Pages/Login")}
            className="px-8 py-3 border border-red-800 hover:border-red-500 text-red-400 hover:text-red-200 font-semibold rounded-lg transition-all duration-200 text-sm tracking-wide"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Login
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {[
            { icon: "📈", label: "SIP Calculator" },
            { icon: "🏦", label: "FD Manager" },
            { icon: "📋", label: "Liability Tracker" },
            { icon: "🎯", label: "Goal Planner" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 bg-black/40 border border-red-900/50 px-4 py-2 rounded-full text-sm text-red-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span>{feature.icon}</span>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
