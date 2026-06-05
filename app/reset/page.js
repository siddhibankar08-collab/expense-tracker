"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResetPassword() {
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-6 relative overflow-hidden font-sans antialiased">
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md scale-90">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="px-5 py-2 rounded-full bg-[#D8EBFA]">
            <span className="text-[#0C336A] font-semibold text-sm">
              Security Update
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#0C336A] mb-4">
            Reset Password
          </h1>

          <p className="text-gray-500 text-lg">
            Choose a strong password to protect your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5">
          <p className="text-center text-gray-500 mb-8">
            Please enter and confirm your new security credentials
          </p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* New Password Input Group */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0C336A] block px-1">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showNewPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-[#0C336A] font-medium outline-none shadow-sm transition-all duration-300 focus:border-[#0C336A] focus:ring-4 focus:ring-blue-100 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors text-lg"
                >
                  {showNewPass ? "👁️" : "👁️"}
                </button>
              </div>
            </div>

            {/* Confirm Password Input Group */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0C336A] block px-1">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-[#0C336A] font-medium outline-none shadow-sm transition-all duration-300 focus:border-[#0C336A] focus:ring-4 focus:ring-blue-100 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors text-lg"
                >
                  {showConfirmPass ? "👁️" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submitting Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#0C336A] text-white font-semibold text-xl hover:bg-[#08264D] transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-3 shadow-lg shadow-blue-900/10"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link
            href="/Forgot_pass"
            className="text-[#0C336A] font-semibold hover:underline"
          >
            ← Back
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs italic text-gray-500 mt-4">
          * Ensure your password uses numbers, letters, and special symbols for maximum security.
        </p>
      </div>
    </div>
  );
}