"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  return (
    <div className="relative min-h-screen bg-[#F5F7FB] overflow-hidden flex items-center justify-center px-6">

      {/* Background Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"></div>

      {/* Floating Accent */}
      <div className="absolute top-20 right-20 w-24 h-24 border border-blue-200 rounded-3xl rotate-12 opacity-40"></div>

      <div className="absolute bottom-24 left-20 w-16 h-16 border border-blue-300 rounded-2xl -rotate-12 opacity-40"></div>

      {/* Main Content */}
<div className="relative z-10 w-full max-w-md scale-105">        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#D8EBFA] px-5 py-2 rounded-full">
            <span className="text-[#0C336A] text-sm font-semibold">
              Account Recovery
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#0C336A] mb-4">
            Forgot Password?
          </h1>

          <p className="text-gray-600 leading-relaxed">
            Enter your email address and we'll send you a
            verification code to securely reset your password.
          </p>
        </div>

        {/* Card */}
        <div
          className="
            bg-white
            rounded-3xl
            p-8
            border
            border-gray-100
            shadow-[0_25px_80px_rgba(12,51,106,0.12)]
          "
        >
          <label className="block text-gray-700 font-medium mb-2">
            Email Address
          </label>

          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              bg-gray-100
              text-black
              placeholder:text-gray-400
              rounded-xl
              px-4
              py-3
              outline-none
              border border-transparent
              focus:border-[#0C336A]
              focus:bg-white
              transition
            "
          />

          {email.length > 0 && !isValidEmail && (
            <p className="text-red-500 text-sm mt-2">
              Please enter a valid email address.
            </p>
          )}

          <button
            disabled={!isValidEmail}
            className={`
              w-full
              mt-6
              py-3
              rounded-xl
              font-semibold
              text-white
              transition-all
              duration-300
              ${
                isValidEmail
                  ? "bg-[#0C336A] hover:bg-[#08264D] hover:-translate-y-0.5"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            Send Verification Code
          </button>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="
              text-[#0C336A]
              font-semibold
              hover:underline
            "
          >
            ← Back to Login
          </Link>
        </div>

        {/* Security Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            * Verification codes expire after 10 minutes for
            security reasons.
          </p>
        </div>
      </div>
    </div>
  );
}