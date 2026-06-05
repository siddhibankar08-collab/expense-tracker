"use client";

import Link from "next/link";
import { useRef } from "react";

export default function EnterOTP() {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md scale-90">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="px-5 py-2 rounded-full bg-[#D8EBFA] shadow-sm">
            <span className="text-[#0C336A] font-semibold text-sm">
              Verification Required
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#0C336A] mb-4">
            Enter OTP
          </h1>

          <p className="text-gray-500 text-lg">
            We've sent a verification code to
          </p>

          <div className="inline-flex mt-4 bg-[#D8EBFA] px-4 py-2 rounded-xl shadow-sm">
            <span className="text-[#0C336A] font-semibold">
              john@example.com
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <p className="text-center text-gray-500 mb-8">
            Enter the 4-digit verification code
          </p>

          {/* OTP Boxes */}
            <div className="flex justify-center gap-2 mb-8">            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="
                  w-16
                  h-16
                  rounded-2xl
                  border
                  border-white
                  bg-gradient-to-br
                  from-white
                  to-blue-50
                  text-center
                  text-3xl
                  font-bold
                  text-[#0C336A]
                  outline-none

                  shadow-[0_12px_30px_rgba(12,51,106,0.12)]

                  transition-all
                  duration-300

                  hover:shadow-[0_18px_40px_rgba(12,51,106,0.18)]

                  focus:border-[#0C336A]
                  focus:ring-4
                  focus:ring-blue-100
                  focus:shadow-[0_20px_45px_rgba(12,51,106,0.22)]
                  focus:scale-105
                "
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm">
              Code expires in
            </p>

            <p className="text-[#0C336A] text-xl font-bold mt-1">
              09:57
            </p>
          </div>

          {/* Verify Button */}
          <button
            className="
              w-full
              py-4
              rounded-xl
              bg-[#0C336A]
              text-white
              font-semibold
              text-lg
              hover:bg-[#08264D]
              transition-all
              duration-300
              hover:scale-[1.01]
              shadow-lg
            "
          >
            Verify & Continue
          </button>

          {/* Resend */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Didn't receive the code?
            </p>

            <button
              type="button"
              className="
                mt-2
                text-[#0C336A]
                font-semibold
                hover:underline
              "
            >
              Resend OTP
            </button>
          </div>
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
          * Verification codes expire after 10 minutes for security purposes.
        </p>
      </div>
    </div>
  );
}