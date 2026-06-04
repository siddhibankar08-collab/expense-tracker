"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
export default function LoginPage() {
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
    console.log(process.env.NEXT_PUBLIC_SUPABASE_URL); 

const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

  console.log("DATA:", data);
  console.log("ERROR:", error);
};
  

  const togglePassword = () => {
    console.log("toggle password");
  };

  return (
    <div className="h-screen w-screen flex bg-[#f5f6fa]">

      {/* LEFT SIDE */}
      <div className="w-[50%] bg-[#142F6E] px-10 py-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/images/spendwiselogo.png"
            alt="SpendWise Logo"
            className="h-12 w-auto"
          />

          <h1 className="text-white text-3xl font-bold">
            SpendWise
          </h1>
        </div>

        {/* Heading */}
        <div className="mt-18">
          <h2 className="text-white text-[34px] font-extrabold leading-tight">
            Money clarity
            <br />
            for life and business.
          </h2>

          <p className="text-white/90 text-[14px] mt-3 max-w-md leading-7">
            Track personal expenses and manage multiple shops in one place — with powerful analytics and smart reports.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 mt-4 max-w-[520px]">

          <div className="bg-[#132A55] rounded-xl p-4">
            <div className="text-green-400 text-lg">💳</div>
            <h3 className="text-white text-sm font-semibold mt-3">
              Personal Expense Tracking
            </h3>
            <p className="text-gray-300 text-xs mt-2">
              Log daily spending and stay on top of your budget
            </p>
          </div>

          <div className="bg-[#132A55] rounded-xl p-4">
            <div className="text-green-400 text-lg">🏪</div>
            <h3 className="text-white text-sm font-semibold mt-3">
              Multi-Shop Management
            </h3>
            <p className="text-gray-300 text-xs mt-2">
              Track finances across all your shops in one place
            </p>
          </div>

          <div className="bg-[#132A55] rounded-xl p-4">
            <div className="text-green-400 text-lg">📈</div>
            <h3 className="text-white text-sm font-semibold mt-3">
              Smart Analytics
            </h3>
            <p className="text-gray-300 text-xs mt-2">
              Profit trends, budgets and category breakdowns
            </p>
          </div>

          <div className="bg-[#132A55] rounded-xl p-4">
            <div className="text-green-400 text-lg">📊</div>
            <h3 className="text-white text-sm font-semibold mt-3">
              Unified Reports
            </h3>
            <p className="text-gray-300 text-xs mt-2">
              Personal and business insights in one dashboard
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-[45%] flex items-center justify-center bg-[#f8f8fb]">

        <div className="w-[400px]">

          <h1 className="text-[44px] mt-4 font-bold text-[#163559]">
            Log in
          </h1>

          {/* Email */}
          <div className="mt-1">
            <label className="block text-sm mb-1">
              Email address
            </label>

            <input
              type="email"
               onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 bg-[#E7E7E7] rounded-2xl px-4 border border-gray-400 outline-none"
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="block text-sm mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type="password"
               onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 bg-[#E7E7E7] rounded-2xl px-4 pr-16 border border-gray-400 outline-none"
              />

              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lg"
              >
                👁
              </button>
            </div>
          </div>

          {/* Remember + Forgot Password */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              <input type="checkbox" />
              <span className="ml-2 text-sm">
                Remember me
              </span>
            </div>

            <p className="text-sm italic text-[#163559] cursor-pointer">
              Forget Password
            </p>
          </div>

          {/* Login */}
          <div className="flex justify-center mt-3">
            <button
              onClick={handleLogin}
              className="w-40 h-10 bg-[#163559] text-white text-lg rounded-full font-semibold"
            >
              Login
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-1 h-px bg-gray-400"></div>
            <span className="px-4 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-400"></div>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center gap-4">

            <button className="w-56 h-10 rounded-lg bg-[#C7CCD4] text-[#163559] text-sm font-medium">
              Continue with Google
            </button>

            <button className="w-56 h-10 rounded-lg bg-[#C7CCD4] text-[#163559] text-sm font-medium">
              Continue with Facebook
            </button>

            <button className="w-56 h-10 rounded-lg bg-[#C7CCD4] text-[#163559] text-sm font-medium">
              Continue with Apple
            </button>

          </div>

          {/* Links */}
          <div className="text-center mt-5">
            <p className="text-xs">
              Don't have an account?{" "}
              <span className="font-semibold underline cursor-pointer">
                Sign up
              </span>
            </p>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">
            By continuing, you agree to our Terms & Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  );
}