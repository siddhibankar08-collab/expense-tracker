import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#D8EBFA] min-h-screen">
      {/* Top Navigation Bar */}
      <div className="bg-[#0C336A] w-full px-8 md:px-12 py-6 md:py-10 flex items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/spendwiselogo.png"
              alt="SpendWise Logo"
              width={70}
              height={70}
              className="rounded-xl"
            />
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-bold">
                SpendWise
              </h1>
              <p className="text-blue-200 text-xs md:text-sm">
                Track Smarter • Spend Better
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center px-6 py-16 md:py-24">
        <div className="bg-[#A2D5FB] px-6 py-2 rounded-full inline-block">
          <p className="text-[#0C336A] font-semibold text-base md:text-lg">
            Personal. Multishop. Simple.
          </p>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-8 text-center leading-tight">
          Track every dollar across your
        </h1>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#052E67] mt-2 text-center">
          Life and Shops.
        </h1>

        <p className="text-center text-base md:text-xl mt-6 text-gray-700 max-w-2xl leading-relaxed">
          Clean dashboards for your personal expenses and as many shops as
          <br className="hidden md:block" />
          you run. No setup, no clutter — just clarity.
        </p>

        <Link href="/login">
          <button className="mt-10 bg-[#0C336A] text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-[#052E67] transition-all duration-300 hover:scale-105">
            Get Started →
          </button>
        </Link>
      </div>

      {/* White Section */}
      <div className="bg-white mt-16 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
          {/* Section Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0C336A] mb-12 md:mb-16">
            Why Choose SpendWise?
          </h2>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-md hover:bg-[#0C336A] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">💰</div>
              <h3 className="text-2xl font-bold text-[#0C336A] group-hover:text-white mb-4">
                Personal Expense Tracking
              </h3>
              <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed">
                Record daily income and expenses effortlessly and understand
                where your money goes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-md hover:bg-[#0C336A] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🏪</div>
              <h3 className="text-2xl font-bold text-[#0C336A] group-hover:text-white mb-4">
                Multi-Shop Management
              </h3>
              <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed">
                Manage multiple shops separately while keeping everything
                organized in one place.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-md hover:bg-[#0C336A] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-2xl font-bold text-[#0C336A] group-hover:text-white mb-4">
                Reports & Insights
              </h3>
              <p className="text-gray-600 group-hover:text-blue-100 leading-relaxed">
                View spending trends and financial summaries to make smarter
                decisions.
              </p>
            </div>
          </div>

          {/* Privacy Card */}
          <div className="mt-20 flex justify-center">
            <div className="bg-[#0C336A] text-white rounded-3xl p-10 md:p-14 max-w-4xl w-full shadow-xl text-center">
              {/* Lock Icon */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-3xl">
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
                Your personal and shop expense data remains private, protected,
                and accessible only to you.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-8 text-center text-gray-500">
          <p>© 2026 SpendWise. Built simply.</p>
        </div>
      </div>
    </div>
  );
}