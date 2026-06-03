import Link from "next/link";
export default function Home() {
  return (
    <div className="bg-[#D8EBFA] min-h-screen">

      {/* Header */}
      <div className="flex items-center px-12 pt-16">
        <h1 className="text-[#0C336A] text-4xl font-bold">
          SpendWise
        </h1>
      </div>

      <hr className="mt-6 border-gray-400" />

      {/* Hero Section */}
      <div className="flex flex-col items-center mt-24">

        <div className="bg-[#A2D5FB] px-8 py-2 rounded-[20px]">
          <p className="text-lg font-medium">
            Personal.Multishop.Simple
          </p>
        </div>

        <h1 className="text-5xl font-extrabold mt-6 text-center">
          Track every dollar across your
        </h1>

        <h1 className="text-5xl font-extrabold text-[#052E67] mt-2">
          Life and Shops.
        </h1>

        <p className="text-center text-xl mt-8 font-light">
          Clean dashboards for your personal expenses and as many shops as
          <br />
          you run. No setup, no clutter — just clarity.
        </p>

        <Link href="/login">
  <button className="mt-8 bg-[#0C336A] text-white px-10 py-3 rounded-lg font-bold shadow-lg">
    Get Started →
  </button>
</Link>

      </div>

      {/* White Section */}
      <div className="bg-white mt-32 min-h-[600px]">

        <hr className="mt-20 border-gray-400" />

        <div className="text-center py-8 text-lg font-light">
          © 2026 SpendWise. Built simply
        </div>

      </div>

    </div>
  );
}