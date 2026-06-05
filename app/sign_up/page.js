"use client";

import { useState } from "react";

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isPasswordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const canCreateAccount =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    isPasswordValid &&
    passwordsMatch &&
    acceptedTerms;

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-6 py-8">
<div className="w-full max-w-5xl h-[95vh] bg-white rounded-3xl overflow-hidden shadow-xl grid lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="bg-[#1B2F6B] text-white p-4 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center bg-[#233A79] px-5 py-3 rounded-xl mb-10">
              <span className="text-2xl mr-2">📈</span>
              <span className="text-2xl font-bold">SpendWise</span>
            </div>

            <h1 className="text-3xl font-bold leading-tight mb-4">
              Money clarity
              <br />
              for life and business.
            </h1>

            <p className="text-blue-100 text-sm">
              Manage personal finances and business expenses
              from one powerful dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="bg-[#233A79] rounded-xl p-3">
              <h3 className="font-semibold text-sm mb-1">                Expense Tracking
              </h3>
              <p className="text-xs text-blue-100">
                Monitor every transaction.
              </p>
            </div>

            <div className="bg-[#233A79] rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-1">                Business Insights
              </h3>
              <p className="text-sm text-blue-100">
                Understand revenue trends.
              </p>
            </div>

            <div className="bg-[#233A79] rounded-2xl p-4">
<h3 className="font-semibold text-sm mb-1">                Smart Reports
              </h3>
              <p className="text-sm text-blue-100">
                Generate detailed summaries.
              </p>
            </div>

            <div className="bg-[#233A79] rounded-2xl p-4">
<h3 className="font-semibold text-sm mb-1">                Secure Data
              </h3>
              <p className="text-sm text-blue-100">
                Protected and encrypted.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-sm">

            <h2 className="text-3xl font-bold text-[#1B2F6B] mb-1">
              Create Account
            </h2>

<p className="text-gray-500 text-sm mb-5">              Start your financial journey with SpendWise.
            </p>

            {/* Full Name */}
            <div className="mb-5">
<label className="block text-gray-700 text-sm font-medium mb-1">                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1B2F6B]"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
<label className="block text-gray-700 text-sm font-medium mb-1">                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1B2F6B]"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
<label className="block text-gray-700 text-sm font-medium mb-1">                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1B2F6B]"
              />

              {password.length > 0 && (
<div className="mt-2 space-y-0.5 text-xs">                  <p className={hasMinLength ? "text-green-600" : "text-red-500"}>
                    {hasMinLength ? "✓" : "✗"} At least 8 characters
                  </p>

                  <p className={hasUppercase ? "text-green-600" : "text-red-500"}>
                    {hasUppercase ? "✓" : "✗"} One uppercase letter
                  </p>

                  <p className={hasLowercase ? "text-green-600" : "text-red-500"}>
                    {hasLowercase ? "✓" : "✗"} One lowercase letter
                  </p>

                  <p className={hasNumber ? "text-green-600" : "text-red-500"}>
                    {hasNumber ? "✓" : "✗"} One number
                  </p>

                  <p className={hasSpecial ? "text-green-600" : "text-red-500"}>
                    {hasSpecial ? "✓" : "✗"} One special character
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
<label className="block text-gray-700 text-sm font-medium mb-1">                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#1B2F6B]"
              />

              {confirmPassword.length > 0 && (
                <p
                  className={`mt-2 text-sm ${
                    passwordsMatch
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {passwordsMatch
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) =>
                  setAcceptedTerms(e.target.checked)
                }
                className="h-4 w-4 mt-1 accent-[#1B2F6B]"
              />

<p className="text-xs text-gray-600">                I agree to the Terms of Service and Privacy Policy.
              </p>
            </div>

            {/* Button */}
            <button
              disabled={!canCreateAccount}
              className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all duration-300 ${
                canCreateAccount
                  ? "bg-[#1B2F6B] hover:bg-[#142252] hover:shadow-lg"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Create Account
            </button>

            {/* Login */}
<p className="text-center text-sm text-gray-500 mt-4">              Already have an account?{" "}
              <span className="text-[#1B2F6B] font-semibold cursor-pointer hover:underline">
                Log In
              </span>
            </p>

            {/* Privacy */}
<div className="mt-5 text-center">
                <p className="text-xs text-gray-400 italic">
                Your data is encrypted and securely stored.
                SpendWise never sells your personal information.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}