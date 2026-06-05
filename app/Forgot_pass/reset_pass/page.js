"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResetPassword() {
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-6 py-8 font-sans antialiased">
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-1.5 rounded-full bg-[#D8EBFA]">
            <span className="text-[#0C336A] font-semibold text-sm">
              Security Update
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0C336A] mb-2">
            Reset Password
          </h1>
          <p className="text-gray-500 text-base">
            Choose a strong password to protect your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          
          <p className="text-center text-gray-500 text-sm mb-6 pb-2 border-b border-gray-100">
            Please enter and confirm your new security credentials
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* New Password */}
            <div>
              <label className="text-sm font-semibold text-[#0C336A] block mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0C336A] text-sm outline-none transition-all focus:border-[#0C336A] focus:bg-white focus:ring-2 focus:ring-blue-100 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-[#0C336A] block mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0C336A] text-sm outline-none transition-all focus:border-[#0C336A] focus:bg-white focus:ring-2 focus:ring-blue-100 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0C336A] text-white font-semibold text-base hover:bg-[#08264D] transition-all mt-4 shadow-md"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/Forgot_pass"
            className="text-[#0C336A] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span className="text-lg">←</span> Back
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed max-w-sm mx-auto">
          * Ensure your password uses numbers, letters, and special symbols for maximum security.
        </p>
      </div>
    </div>
  );
}