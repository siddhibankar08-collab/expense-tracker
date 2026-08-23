import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#0A0A0C] min-h-screen font-sans antialiased text-neutral-100">
      
      {/* Upper Layout Wrapper with subtle Greyish Tint */}
      <div className="bg-[#16161A] relative overflow-hidden pb-16">
        {/* Ambient radial lighting effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        {/* Premium Navigation Bar */}
<header className="relative bg-[#171717] w-full h-24 px-6 md:px-12 py-3 flex items-center justify-between shadow-xl border-b border-neutral-900 backdrop-blur-md">          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          
          {/* Left Side Brand Layout */}
          <div className="flex items-center gap-4 relative z-10">
            {/* Logo Container in Green */}
            <div className="p-1.5 bg-zinc-950 rounded-xl border border-[#04d292] shadow-sm flex items-center justify-center shrink-0">
              <Image
                src="/images/spend.png"
                alt="SpendWise Logo"
                width={50}
                height={50}
              />
            </div>
            
            {/* Typography block in Green */}
            <div className="flex flex-col justify-center">
              <h1 className="text-emerald-400 text-xl md:text-2xl font-black tracking-tight leading-none">
                Spend<span className="text-emerald">Wise</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-neutral-500 text-[9px] font-bold tracking-widest uppercase">
                  Track Smarter • Spend Better
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Action */}
          <div className="relative z-10">
            <Link href="/login">
              <button className="text-xs font-semibold text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-neutral-800 transition-all duration-200 active:scale-95">
                Login
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center mt-16 md:mt-24 px-6 shrink-0 relative z-10">
          <div className="bg-[#222226] border border-neutral-700/50 px-6 py-1.5 rounded-full shadow-inner">
            <p className="text-xs md:text-sm font-medium text-neutral-300 tracking-wide">
              Track. Save. Grow.
            </p>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mt-8 text-center text-white tracking-tight leading-tight max-w-4xl">
            Track every transaction across 
          </h1>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mt-2 text-center tracking-tight leading-tight">
             your Life
          </h1>

          <p className="text-center text-sm md:text-base mt-6 font-medium max-w-xl text-neutral-400 leading-relaxed">
            Clean dashboards for your personal expenses. No configuration setup needed — just pure clarity.
          </p>

          <Link href="/login">
            <button className="mt-8 bg-white text-black px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-neutral-200 transition-all duration-300 hover:scale-105 transform active:scale-95 shadow-white/5">
              Get Started →
            </button>
          </Link>
        </main>
      </div>

      {/* Deep Black Features Section (Separated by clean horizontal break line) */}
      <div className="bg-[#0A0A0C] relative z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-neutral-800" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

          {/* Section Heading */}
          <h2 className="text-2xl md:text-3xl font-black text-center text-white mb-16 tracking-tight">
            Why Choose SpendWise?
          </h2>

          {/* Feature Cards Grid (All Unified to Lift & Border Shift Hover Animation) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="group bg-[#121214] border border-neutral-800/80 rounded-2xl p-8 shadow-sm hover:border-neutral-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl mb-6 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                💰
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-neutral-200">
                Personal Expense Tracking
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Record daily income and expenses effortlessly. Understand precisely where your capital goes with visual breakdowns.
              </p>
            </div>

            {/* Card 2 */}
<div className="group bg-[#121214] border border-neutral-800/80 rounded-2xl p-8 shadow-sm hover:border-neutral-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer">
  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl mb-6 group-hover:bg-white group-hover:text-black transition-colors duration-300">
    💳
  </div>
  <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-neutral-200">
    Budget Health Monitor
  </h3>
  <p className="text-neutral-400 text-xs leading-relaxed">
    Instantly see whether your finances are healthy, stable, or need attention with real-time budget analysis and spending insights.
  </p>
</div>

            {/* Card 3 */}
            <div className="group bg-[#121214] border border-neutral-800/80 rounded-2xl p-8 shadow-sm hover:border-neutral-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl mb-6 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                📊
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-neutral-200">
                Reports & Insights
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Review automated category net flows and cross-platform performance comparisons mirroring your transaction images.
              </p>
            </div>

          </div>

          {/* Privacy Box */}
          <div className="mt-24 flex justify-center">
            <div className="bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] border border-neutral-800 rounded-3xl p-8 md:p-12 max-w-4xl w-full shadow-2xl text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff02_0%,transparent_70%)] pointer-events-none" />

              <div className="flex justify-center mb-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-xl border border-white/10 shadow-inner">
                  🔒
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-2 text-white tracking-tight">
                Privacy First
              </h3>
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mb-5">
                Secure by Design
              </p>

              <p className="text-xs md:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                Your personal balances, expense distribution logs, and retail store matrices remain isolated, securely encrypted, and exclusively accessible by your verified credentials.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="border-t border-neutral-900 py-8 text-center text-neutral-600 text-xs font-medium tracking-wide">
          © 2026 SpendWise. Built simply.
        </footer>
      </div>

    </div>
  );
}