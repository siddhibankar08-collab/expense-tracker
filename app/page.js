import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#D8EBFA] min-h-screen font-sans antialiased">
      
      {/* Optimized Slim Navigation Bar */}
      <header className="relative bg-gradient-to-r from-[#09264F] via-[#0C336A] to-[#09264F] w-full h-27 px-6 md:px-12 py-3 flex items-center justify-between shadow-2xl border-b border-white/10">
        
        {/* Subtle top ambient glow effect */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
        
        {/* Left Side Brand Layout */}
        <div className="flex items-center gap-4 relative z-10">
          {/* Logo Container */}
          <div className="relative p-1.5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-inner group transition-all duration-300 hover:border-blue-400/50">
            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image
              src="/images/spendwiselogo.png"
              alt="SpendWise Logo"
              width={60}
              height={60}
              className="object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Typography block */}
          <div className="flex flex-col justify-center">
            <h1 className="text-white text-xl md:text-3xl font-black tracking-tight leading-none flex items-center gap-1.5">
              Spend<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Wise</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-blue-200/70 text-[10px] font-semibold tracking-widest uppercase">
                Track Smarter • Spend Better
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Navigation Actions */}
        {/* Add items here if needed */}
        
      </header>

      {/* Hero Section */}
<main className="flex flex-col items-center mt-10 px- py-6 md:py-2 shrink-0">        <div className="bg-[#A2D5FB] px-8 py-2 rounded-[20px] shadow-sm">
          <p className="text-lg font-medium text-[#0C336A]">
            Personal. Multishop. Simple.
          </p>
        </div>

        <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold mt-8 text-center text-slate-900 leading-tight">
          Track every dollar across your
        </h1>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#052E67] mt-1 text-center leading-tight">
          Life and Shops.
        </h1>

        <p className="text-center text-base md:text-xl mt-8 font-light max-w-2xl text-slate-800 leading-relaxed">
          Clean dashboards for your personal expenses and as many shops as
          <br className="hidden md:block" /> you run. No setup, no clutter — just clarity.
        </p>

        <Link href="/login">
          <button className="mt-8 bg-[#0C336A] text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-[#052E67] transition-all duration-300 hover:scale-105 transform active:scale-95">
            Get Started →
          </button>
        </Link>

      </main>

      {/* White Section */}
      <div className="bg-white mt-15 rounded-t-3xl">

        <hr className="border-gray-200" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

          {/* Section Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0C336A] mb-14 tracking-tight">
            Why Choose SpendWise?
          </h2>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-md hover:bg-[#0C336A] hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">💰</div>
              <h3 className="text-2xl font-bold text-[#0C336A] group-hover:text-white mb-4 transition-colors">
                Personal Expense Tracking
              </h3>
              <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed transition-colors">
                Record daily income and expenses effortlessly and understand where your money goes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-md hover:bg-[#0C336A] hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🏪</div>
              <h3 className="text-2xl font-bold text-[#0C336A] group-hover:text-white mb-4 transition-colors">
                Multi-Shop Management
              </h3>
              <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed transition-colors">
                Manage multiple shops separately while keeping everything organized in one place.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-md hover:bg-[#0C336A] hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-2xl font-bold text-[#0C336A] group-hover:text-white mb-4 transition-colors">
                Reports & Insights
              </h3>
              <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed transition-colors">
                View spending trends and financial summaries to make smarter decisions.
              </p>
            </div>

          </div>

          {/* Privacy Card */}
          <div className="mt-20 flex justify-center">
            <div className="bg-[#0C336A] text-white rounded-3xl p-10 md:p-14 max-w-4xl w-full shadow-xl text-center">

              {/* Lock Icon */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/15 text-3xl">
                  🔒
                </div>
              </div>

              {/* Heading */}
              <h3 className="text-3xl md:text-4xl font-bold mb-3">
                Privacy First
              </h3>

              {/* Subtitle */}
              <p className="text-blue-200 text-sm uppercase tracking-wider mb-6">
                Secure by Design
              </p>

              {/* Description */}
              <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Your personal and shop expense data remains private, protected, and accessible only to you.
              </p>

            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
          © 2026 SpendWise. Built simply.
        </footer>

      </div>
    </div>
  );
}